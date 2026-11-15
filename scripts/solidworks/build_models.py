"""
Build public/models/apollo11lm.glb and sojourner.glb from the team's SolidWorks files.

  python3 scripts/solidworks/build_models.py <models dir> <out dir>
  node scripts/solidworks/finalize-glb.mjs <out dir>/<id>.raw.glb public/models/<id>.glb

Every clickable part becomes one glTF node named exactly like the part id in src/data/vehicles/*.ts.
Parts that do not exist in the CAD files (contact probes, plaque, Sojourner cameras/lasers) are
added as simple shapes. Scene items (lander, EASEP, retroreflector) stay procedural in the app.
"""
import json, math, os, struct, sys
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
from swfile import sections, biggest, displaylist_bodies, assembly_instances

SRC, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)

# ---------------------------------------------------------------- tiny glTF writer
MATS = {
    'gold':      dict(c=(0.80, 0.58, 0.20), m=0.85, r=0.32),
    'goldDark':  dict(c=(0.55, 0.38, 0.12), m=0.8, r=0.4),
    'silverFoil':dict(c=(0.82, 0.82, 0.80), m=0.9, r=0.3),
    'black':     dict(c=(0.07, 0.07, 0.08), m=0.3, r=0.65),
    'aluminium': dict(c=(0.70, 0.71, 0.73), m=0.75, r=0.38),
    'steel':     dict(c=(0.62, 0.63, 0.65), m=0.85, r=0.3),
    'darkMetal': dict(c=(0.18, 0.18, 0.20), m=0.7, r=0.45),
    'engine':    dict(c=(0.24, 0.23, 0.24), m=0.8, r=0.42),
    'white':     dict(c=(0.86, 0.86, 0.84), m=0.05, r=0.6),
    'cells':     dict(c=(0.08, 0.12, 0.26), m=0.55, r=0.25),
    'lens':      dict(c=(0.02, 0.03, 0.05), m=0.9, r=0.08),
    'laser':     dict(c=(0.9, 0.1, 0.08), m=0.1, r=0.4, e=(0.9, 0.08, 0.05)),
    'plaque':    dict(c=(0.80, 0.81, 0.83), m=0.95, r=0.22),
}


class Model:
    def __init__(self):
        self.parts = {}  # part -> mat -> [ (P, N, T) ]

    def add(self, part, mat, P, N, T):
        if len(T):
            self.parts.setdefault(part, {}).setdefault(mat, []).append((P, N, T))

    def bounds(self, part=None):
        allp = [P[np.unique(T)] for p, mm in self.parts.items() if part in (None, p) for l in mm.values() for P, _, T in l]
        A = np.concatenate(allp)
        return A.min(0), A.max(0)

    def write(self, path, rootname):
        bin_, views, accs, meshes, nodes, mats = bytearray(), [], [], [], [], []
        mat_idx = {}

        def view(arr, target):
            nonlocal bin_
            while len(bin_) % 4:
                bin_ += b'\0'
            off = len(bin_)
            bin_ += arr.tobytes()
            views.append(dict(buffer=0, byteOffset=off, byteLength=arr.nbytes, target=target))
            return len(views) - 1

        def acc(arr, typ, ctype, target, mm=False):
            a = dict(bufferView=view(arr, target), componentType=ctype, count=len(arr), type=typ)
            if mm:
                a['min'] = arr.min(0).tolist(); a['max'] = arr.max(0).tolist()
            accs.append(a)
            return len(accs) - 1

        for part, mm in self.parts.items():
            prims = []
            for mat, lst in mm.items():
                if mat not in mat_idx:
                    d = MATS[mat]
                    m = dict(name=mat, pbrMetallicRoughness=dict(baseColorFactor=[*d['c'], 1.0], metallicFactor=d['m'], roughnessFactor=d['r']))
                    if 'e' in d:
                        m['emissiveFactor'] = list(d['e'])
                    mats.append(m); mat_idx[mat] = len(mats) - 1
                Ps, Ns, Ts, o = [], [], [], 0
                for P, N, T in lst:
                    Ps.append(P); Ns.append(N); Ts.append(T + o); o += len(P)
                P = np.concatenate(Ps).astype('<f4'); N = np.concatenate(Ns).astype('<f4')
                N /= np.maximum(np.linalg.norm(N, axis=1, keepdims=True), 1e-9)
                T = np.concatenate(Ts).astype('<u4').reshape(-1)
                prims.append(dict(attributes=dict(POSITION=acc(P, 'VEC3', 5126, 34962, True), NORMAL=acc(N, 'VEC3', 5126, 34962)),
                                  indices=acc(T, 'SCALAR', 5125, 34963), material=mat_idx[mat]))
            meshes.append(dict(name='geo', primitives=prims))
            nodes.append(dict(name=part, mesh=len(meshes) - 1))
        nodes.append(dict(name=rootname, children=list(range(len(nodes)))))
        gl = dict(asset=dict(version='2.0', generator='Beyond the Dust SolidWorks reader'), scene=0,
                  scenes=[dict(nodes=[len(nodes) - 1])], nodes=nodes, meshes=meshes, materials=mats,
                  accessors=accs, bufferViews=views, buffers=[dict(byteLength=len(bin_))])
        js = json.dumps(gl, separators=(',', ':')).encode()
        js += b' ' * (-len(js) % 4); bin_ += b'\0' * (-len(bin_) % 4)
        with open(path, 'wb') as f:
            f.write(struct.pack('<III', 0x46546C67, 2, 12 + 8 + len(js) + 8 + len(bin_)))
            f.write(struct.pack('<I', len(js)) + b'JSON' + js)
            f.write(struct.pack('<I', len(bin_)) + b'BIN\0' + bytes(bin_))


def soup(P, N):
    return P, N, np.arange(len(P)).reshape(-1, 3)


def split_tris(P, N, T, pred):
    """Split a mesh by a predicate on triangle centroids -> (in, out)."""
    C = P[T].mean(1)
    k = pred(C)
    return (P, N, T[k]), (P, N, T[~k])


def cylinder(a, b, r, seg=10):
    a, b = np.array(a, float), np.array(b, float)
    ax = b - a; L = np.linalg.norm(ax); ax /= L
    u = np.cross(ax, [0, 1, 0] if abs(ax[1]) < 0.9 else [1, 0, 0]); u /= np.linalg.norm(u); v = np.cross(ax, u)
    P, N, T = [], [], []
    for i in range(seg):
        t = 2 * math.pi * i / seg
        d = math.cos(t) * u + math.sin(t) * v
        P += [a + r * d, b + r * d]; N += [d, d]
    for i in range(seg):
        j = (i + 1) % seg
        T += [(2 * i, 2 * j, 2 * i + 1), (2 * j, 2 * j + 1, 2 * i + 1)]
    return np.array(P), np.array(N), np.array(T)


def box(c, s, R=np.eye(3)):
    c = np.array(c, float); s = np.array(s, float) / 2
    P, N, T = [], [], []
    for ax in range(3):
        for sg in (-1, 1):
            n = np.zeros(3); n[ax] = sg
            u = np.zeros(3); u[(ax + 1) % 3] = 1; v = np.zeros(3); v[(ax + 2) % 3] = 1
            base = len(P)
            for du, dv in ((-1, -1), (1, -1), (1, 1), (-1, 1)):
                P.append(c + R @ (n * s + u * s * du + v * s * dv)); N.append(R @ n)
            T += [(base, base + 1, base + 2), (base, base + 2, base + 3)] if sg > 0 else [(base, base + 2, base + 1), (base, base + 3, base + 2)]
    return np.array(P), np.array(N), np.array(T)


def xform(P, N, S, R, t):
    return (P @ R.T) * S + t, N @ R.T


# ---------------------------------------------------------------- Apollo 11 Lunar Module (descent stage)
def build_lm():
    secs = sections(open(os.path.join(SRC, 'Apollo Lunar Module.SLDPRT'), 'rb').read())
    bodies = displaylist_bodies(biggest(secs, 'Contents/DisplayLists'))
    S = 1.45                         # CAD -> metres: footpads end up ~9.4 m apart like the real LM
    a = math.radians(90)             # ladder: CAD +Z -> app +X
    R = np.array([[math.cos(a), 0, math.sin(a)], [0, 1, 0], [-math.sin(a), 0, math.cos(a)]])
    y0 = min(P[:, 1].min() for P, _ in bodies)
    t = np.array([0, -y0 * S, 0])
    m = Model(); removed = 0
    for k, (P, N) in enumerate(bodies):
        mn, mx = P.min(0), P.max(0)
        if mx[1] > 3.0 or mn[1] >= 2.42:          # ascent stage: it flew back to orbit in 1969
            removed += 1
            continue
        W, Wn = xform(P, N, S, R, t)
        g = soup(W, Wn)
        if mx[1] < 0.3:                                   part, mat = 'landing-legs', 'aluminium'   # footpads
        elif k in (29, 30, 31, 32):                       part, mat = 'landing-legs', 'goldDark'
        elif k in (39, 40, 46, 47, 48, 49):               part, mat = 'landing-legs', 'aluminium'
        elif k in (17, 18):                               part, mat = 'descent-engine', 'engine'
        elif k == 16:                                     part, mat = 'descent-stage-body', 'black'
        elif k in (128, 130, 132, 141):                   part, mat = 'ladder-porch', 'aluminium'
        elif mn[1] >= 1.95:                               part, mat = 'ascent-stage-launchpad', 'black' if mx[1] - mn[1] < 0.4 and abs(mn[0]) > 1.9 else 'aluminium'
        else:                                             part, mat = 'descent-stage-body', 'gold'
        if part == 'descent-stage-body' and mat == 'gold':
            # MESA (equipment bay) = the octagon face left of the ladder: CAD +X/+Z diagonal -> app +X/-Z
            ang = lambda C: np.degrees(np.arctan2(C[:, 2], -C[:, 0]))   # in app coords, angle from +X toward -Z
            def pred(C):
                aa = np.degrees(np.arctan2(-C[:, 2], C[:, 0]))
                r = np.hypot(C[:, 0], C[:, 2])
                return (aa > 25) & (aa < 65) & (r > 2.2) & (C[:, 1] > 1.35) & (C[:, 1] < 2.95)
            inn, out = split_tris(*g, pred)
            m.add('equipment-bay', 'silverFoil', *inn)
            m.add(part, mat, *out)
        else:
            m.add(part, mat, *g)
    # Footpad centres (bodies lying on the ground), in app coordinates.
    pads = np.concatenate([xform(P, N, S, R, t)[0] for P, N in bodies if P[:, 1].max() < 0.3])
    centres = []
    for ang in (0, 90, 180, 270):
        d = np.array([math.cos(math.radians(ang)), 0, -math.sin(math.radians(ang))])
        sel = pads[(pads[:, [0, 2]] @ d[[0, 2]]) > 2.5]
        centres.append((ang, d, sel.mean(0), sel[:, 1].max()))
    # Contact probes (not in the CAD): 1.7 m rods under 3 footpads (not the ladder leg), bent on landing.
    for ang, d, c, top in centres:
        if ang == 0:
            continue
        side = np.cross(d, [0, 1, 0])
        foot = np.array([c[0], 0.06, c[2]]) + d * 0.1
        bend = foot + d * 0.35 + np.array([0, -0.03, 0])
        tip = bend + d * 0.7 + side * 0.6
        tip[1] = 0.03
        for a_, b_ in ((foot, bend), (bend, tip)):
            m.add('contact-probes', 'aluminium', *cylinder(a_, b_, 0.022, 8))
    # Plaque (not in the CAD): stainless plate on the ladder leg strut, behind the rungs.
    lad = xform(bodies[141][0], bodies[141][1], S, R, t)[0]
    k_, b_ = np.polyfit(lad[:, 1], lad[:, 0], 1)          # ladder line x = k*y + b
    py = 1.75
    px = k_ * py + b_ - 0.12
    tilt = math.atan(k_)                                   # lean of the strut
    Rz = np.array([[math.cos(tilt), -math.sin(tilt), 0], [math.sin(tilt), math.cos(tilt), 0], [0, 0, 1]])
    m.add('plaque', 'plaque', *box([px, py, 0.0], [0.02, 0.23, 0.29], Rz))
    print('footpads', [(a, c.round(2)) for a, _, c, _ in centres], 'plaque', round(px, 2), py)
    print('LM bodies kept', len(bodies) - removed, 'removed (ascent stage)', removed)
    return m


# ---------------------------------------------------------------- Sojourner rover
SOJ_PART = [
    ('Spectrometer', 'apxs', 'white'),
    ('Antenna', 'uhf-antenna', 'aluminium'),
    ('Main Body', 'warm-electronics-box', 'gold'),
    ('Solar Panel', 'solar-panel', None),
    ('=Front L.STEP', 'solar-panel', 'aluminium'), ('=Rear L.STEP', 'solar-panel', 'aluminium'), ('=Hinge.STEP', 'solar-panel', 'aluminium'),
    ('3 x 0.5 x 6 Socket', 'warm-electronics-box', 'darkMetal'),
    ('Outer Ring', 'six-wheels', 'steel'), ('RIm', 'six-wheels', 'steel'), ('Toothed Part', 'six-wheels', 'steel'),
    ('Motor Holder', 'six-wheels', 'darkMetal'), ('Motor', 'six-wheels', 'darkMetal'), ('hex screw', 'six-wheels', 'darkMetal'),
    ('Front L Clamp', 'six-wheels', 'aluminium'), ('Front Motor', 'six-wheels', 'darkMetal'),
]


def build_sojourner():
    inst, geo = assembly_instances(os.path.join(SRC, 'Sojourner Rover.SLDASM'))
    m = Model()
    world = []
    for name, M, chain in inst:
        P, N, T = geo[name]
        W = (np.c_[P, np.ones(len(P))] @ M)[:, :3]
        Wn = N @ M[:3, :3]
        world.append((name, W, Wn, T))
    allW = np.concatenate([w for _, w, _, _ in world])
    body = next(w for n, w, _, _ in world if n.startswith('Main Body'))
    t = np.array([-(body[:, 0].min() + body[:, 0].max()) / 2, -allW[:, 1].min(), -(body[:, 2].min() + body[:, 2].max()) / 2])
    for name, W, Wn, T in world:
        W = W + t
        part, mat = 'rocker-bogie', 'aluminium'
        for key, p, mt in SOJ_PART:
            if (name == key[1:]) if key.startswith('=') else (key in name):
                part, mat = p, mt
                break
        if part == 'rocker-bogie' and any(s in name for s in ('Hinge', 'Motor', 'screw', 'nut', 'pan slot', 'Rod')):
            mat = 'darkMetal'
        if mat is None:   # solar panel: cells = top faces, frame = the rest
            top = W[:, 1].max()
            inn, out = split_tris(W, Wn, T, lambda C: C[:, 1] > top - 0.004)
            m.add(part, 'cells', *inn); m.add(part, 'aluminium', *out)
        else:
            m.add(part, mat, W, Wn, T)
    # Cameras + laser stripers on the front of the body (not modelled in the CAD).
    lo, hi = m.bounds('warm-electronics-box')
    fx = hi[0]
    cy = lo[1] + 0.085
    m.add('cameras', 'darkMetal', *box([fx + 0.012, cy, 0], [0.024, 0.03, 0.11]))
    for z in (-0.035, 0.035):
        m.add('cameras', 'lens', *cylinder([fx + 0.024, cy, z], [fx + 0.034, cy, z], 0.009, 14))
    ly = lo[1] + 0.035
    m.add('hazard-lasers', 'darkMetal', *box([fx + 0.01, ly, 0], [0.02, 0.022, 0.16]))
    for z in (-0.06, 0.0, 0.06):
        m.add('hazard-lasers', 'laser', *cylinder([fx + 0.02, ly, z], [fx + 0.028, ly, z], 0.006, 10))
    return m


def report(m, name):
    lo, hi = m.bounds()
    print(f'== {name} bounds', lo.round(3), hi.round(3))
    for p in m.parts:
        a, b = m.bounds(p)
        tri = sum(len(T) for l in m.parts[p].values() for _, _, T in l)
        print(f'  {p:24s} tris={tri:7d} min={a.round(3)} max={b.round(3)} centre={((a + b) / 2).round(3)}')


which = sys.argv[3:] or ['apollo11lm', 'sojourner']
if 'apollo11lm' in which:
    lm = build_lm(); report(lm, 'apollo11lm'); lm.write(os.path.join(OUT, 'apollo11lm.raw.glb'), 'apollo11lm')
if 'sojourner' in which:
    so = build_sojourner(); report(so, 'sojourner'); so.write(os.path.join(OUT, 'sojourner.raw.glb'), 'sojourner')
