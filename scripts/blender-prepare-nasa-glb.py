"""
Turn the NASA 3D-resource .glb files into app-ready models: one node per clickable part,
named exactly like the part ids in src/data/vehicles/*.ts, app axes (+X front, +Y up, ground at 0),
no animation, Draco meshes + WebP textures.

  blender -b --disable-autoexec --python scripts/blender-prepare-nasa-glb.py -- <in.glb> <out.glb> <apollo11lm|pioneer10|perseverance> [ref.glb]

apollo11lm: parts are copied by proximity from a reference model (the SolidWorks conversion,
            public/models/apollo11lm-sw.glb) — ascent stage removed (it flew back in 1969);
            contact probes, plaque and MESA panel are taken from that reference.
pioneer10:  the NASA file is split by material, so it is cut into loose pieces and sorted by position.
perseverance: parts come from the node names of the NASA file.
"""
import bpy, sys, math, mathutils
from mathutils import Matrix, Vector
from mathutils.kdtree import KDTree

a = sys.argv[sys.argv.index('--') + 1:]
SRC, OUT, MODE = a[0], a[1], a[2]
REF = a[3] if len(a) > 3 else None

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=SRC)
scene = bpy.context.scene
# Perseverance: its animations deploy the mast, open the camera covers, unstow the arm.
# The animation deploys then stows everything again; freeze it on a deployed frame.
POSE = {'perseverance': 300}.get(MODE, 0)   # frame 300: mast up, arm out, covers open
end = 0
for act in bpy.data.actions:
    end = max(end, int(act.frame_range[1]))
FRAME = int(a[4]) if len(a) > 4 else POSE
# The importer stores each glTF animation as an NLA strip; make them all active so they evaluate together.
for o in scene.objects:
    ad = o.animation_data
    if ad and not ad.action:
        for tr in ad.nla_tracks:
            for st in tr.strips:
                if st.action:
                    ad.action = st.action
                    break
            if ad.action:
                break
        for tr in list(ad.nla_tracks):
            ad.nla_tracks.remove(tr)
scene.frame_set(FRAME)
bpy.context.view_layer.update()
print('pose frame', FRAME, 'of', end)
for o in list(scene.objects):
    o.matrix_world = o.matrix_world.copy()
for o in list(scene.objects):
    o.animation_data_clear()
    for c in list(getattr(o, 'constraints', [])):
        o.constraints.remove(c)
    if o.type == 'MESH':
        for m in list(o.modifiers):
            if m.type == 'ARMATURE':
                o.modifiers.remove(m)
scene.frame_set(0)


def anc_names(o):
    out = []
    while o:
        out.append(o.name)
        o = o.parent
    return out


meta = {o.name: anc_names(o) for o in scene.objects}
# Helper meshes the importer creates for bones / empties (not part of the spacecraft).
for o in list(scene.objects):
    if o.type == 'MESH' and (o.name.startswith('Icosphere') or o.hide_render):
        bpy.data.objects.remove(o, do_unlink=True)

# ---- app transform (expressed in Blender axes: glTF Y-up == Blender Z-up)
if MODE == 'perseverance':
    T = Matrix.Rotation(math.radians(90), 4, 'Z')            # front (+Z glTF) -> +X
elif MODE == 'pioneer10':
    T = Matrix.Rotation(math.radians(180), 4, 'X')           # boom up (+Y), dish opening +Z
else:
    T = Matrix.Identity(4)                                    # set below for the LM

# bake world transforms into the meshes
bpy.ops.object.select_all(action='DESELECT')
for o in scene.objects:
    o.select_set(True)
bpy.ops.object.make_single_user(object=True, obdata=True)
meshes = [o for o in scene.objects if o.type == 'MESH']
for o in meshes:
    mw = o.matrix_world.copy()
    o.data.transform(mw)
for o in meshes:
    o.parent = None
    o.matrix_world = Matrix.Identity(4)
for o in list(scene.objects):
    if o.type != 'MESH':
        bpy.data.objects.remove(o, do_unlink=True)
meshes = [o for o in scene.objects if o.type == 'MESH']


def apply(M):
    for o in meshes:
        o.data.transform(M)


def bounds(objs):
    vs = [v.co for o in objs for v in o.data.vertices]
    return Vector((min(v.x for v in vs), min(v.y for v in vs), min(v.z for v in vs))), Vector((max(v.x for v in vs), max(v.y for v in vs), max(v.z for v in vs)))


part_of = {}

if MODE == 'apollo11lm':
    # Import the reference (already in app frame) and vote by nearest neighbour.
    before = set(scene.objects)
    bpy.ops.import_scene.gltf(filepath=REF)
    refs = [o for o in scene.objects if o not in before]
    for o in refs:
        o.animation_data_clear()
    bpy.context.view_layer.update()
    ref_meshes = [o for o in refs if o.type == 'MESH']
    pts = []
    for o in ref_meshes:
        label = o.name if o.parent is None or o.parent.name == 'apollo11lm' else o.parent.name
        label = label.split('.')[0]
        for v in o.data.vertices:
            pts.append((o.matrix_world @ v.co, label))
    kd = KDTree(len(pts))
    for i, (p, _) in enumerate(pts):
        kd.insert(p, i)
    kd.balance()
    S = 1.45
    lo, _ = bounds(meshes)
    best = None
    for ang in (90, -90):
        M = Matrix.Translation((0, 0, -lo.z * S)) @ Matrix.Rotation(math.radians(ang), 4, 'Z') @ Matrix.Scale(S, 4)
        ds = []
        for o in meshes:
            for v in list(o.data.vertices)[:: max(1, len(o.data.vertices) // 30)]:
                ds.append(kd.find(M @ v.co)[2])
        ds.sort()
        score = ds[len(ds) // 4]
        if best is None or score < best[0]:
            best = (score, M, ang)
    print('LM rotation', best[2], 'quartile distance', round(best[0], 4))
    apply(best[1])
    removed = 0
    for o in list(meshes):
        vs = list(o.data.vertices)
        votes, dist = {}, []
        for v in vs[:: max(1, len(vs) // 200)]:
            co, idx, d = kd.find(v.co)
            dist.append(d)
            if d < 0.12:
                votes[pts[idx][1]] = votes.get(pts[idx][1], 0) + 1
        dist.sort()
        med = dist[len(dist) // 2]
        if med > 0.12 or not votes:
            bpy.data.objects.remove(o, do_unlink=True)
            removed += 1
            continue
        part_of[o.name] = max(votes, key=votes.get)
    print('LM meshes removed (ascent stage):', removed)
    # keep the reference-only parts (not in the NASA file)
    keep = {'contact-probes', 'plaque', 'equipment-bay'}
    for o in refs:
        nm = o.name.split('.')[0]
        par = o.parent.name.split('.')[0] if o.parent else ''
        lab = nm if nm in keep else par if par in keep else None
        if o.type == 'MESH' and lab:
            mw = o.matrix_world.copy()
            o.parent = None
            o.data.transform(mw)
            o.matrix_world = Matrix.Identity(4)
            if lab == 'equipment-bay':   # push the MESA panel 2 cm out of the hull to avoid z-fighting
                n = Vector((0, 0, 0))
                for p in o.data.polygons:
                    n += p.normal * p.area
                n.z = 0
                if n.length:
                    o.data.transform(Matrix.Translation(n.normalized() * 0.02))
            part_of[o.name] = lab
        else:
            bpy.data.objects.remove(o, do_unlink=True)
    meshes = [o for o in scene.objects if o.type == 'MESH']

elif MODE == 'pioneer10':
    apply(T)
    bpy.ops.object.select_all(action='DESELECT')
    for o in meshes:
        o.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.separate(type='LOOSE')
    bpy.ops.object.mode_set(mode='OBJECT')
    meshes = [o for o in scene.objects if o.type == 'MESH']

    # classify in app/glTF axes: x right, y = boom direction (up), z = toward the dish opening
    def g(v):
        return Vector((v.x, v.z, -v.y))

    for o in meshes:
        G = [g(v.co) for v in o.data.vertices]
        mn = Vector((min(p.x for p in G), min(p.y for p in G), min(p.z for p in G)))
        mx = Vector((max(p.x for p in G), max(p.y for p in G), max(p.z for p in G)))
        c = (mn + mx) / 2
        r = math.hypot(c.x, c.y)
        base = o.name.split('.')[0]
        dish_z = -0.5 + 0.53 * min(1.0, (r / 1.37)) ** 2      # back surface of the dish (bus side is -z here)
        if base == 'Foil_trans':                # the plaque plate itself
            p = 'plaque'
        elif c.y > 1.45:
            p = 'magnetometer-boom'
        elif mx.z > 0.3 or base in ('AO_dish',):
            p = 'high-gain-antenna'
        elif base == 'AO_rtg' or (c.y < -0.3 and abs(c.x) > 0.45 and c.z < dish_z - 0.12):
            p = 'rtg'
        elif abs(c.x) > 1.22 and abs(c.y) < 0.4 and c.z > -0.25:
            p = 'thrusters'
        elif 0.5 < r < 1.36 and c.z > dish_z - 0.12:
            p = 'meteoroid-detectors'
        elif c.x < -0.45 and abs(c.y) < 0.45 and r < 0.95:
            p = 'imaging-photopolarimeter'
        elif c.y > 0.45 and r < 0.95:
            p = 'particle-detectors'
        elif r < 1.0:
            p = 'main-body'
        else:
            p = 'high-gain-antenna'
        part_of[o.name] = p

elif MODE == 'perseverance':
    apply(T)
    RULES = {
        'rtg': 'mmrtg', 'Wheels_objs': 'six-wheels', 'suspension': 'six-wheels',
        'PIXL': 'pixl', 'PIXL_cover_01': 'pixl', 'hinge': 'pixl', 'WATSON': 'sherloc-watson',
        'turret_obj': 'coring-drill',
        'arm.001': 'robotic-arm', 'arm.003': 'robotic-arm', 'arm_cable_etc': 'robotic-arm',
        'lab': 'sample-caching',
        'microphones': 'microphones', 'microphones.001': 'microphones',
        'Mastcam_Z_cams': 'mastcam-z', 'calibration_target': 'mastcam-z', 'calibration_target_bracket': 'mastcam-z',
        'lens': 'supercam', 'head': 'supercam',
        'NavCams': 'engineering-cameras', 'hazcams_front': 'engineering-cameras', 'hazcams_front_cover': 'engineering-cameras',
        'hazcams_rear': 'engineering-cameras', 'hazcams_rear_cover_l': 'engineering-cameras', 'hazcams_rear_cover_r': 'engineering-cameras',
        'hazcams_rear_wiring': 'engineering-cameras', 'Up_Look_Camera': 'engineering-cameras', 'Down_Look_Camera': 'engineering-cameras',
        'Cylinder': 'remote-sensing-mast',
        'antenna_uhf': 'antennas', 'antenna_hg': 'antennas', 'antenna_lg': 'antennas',
        'RIMFAX': 'rimfax', 'Name_Chips': 'name-chips',
    }
    for o in meshes:
        p = 'body'
        for n in meta.get(o.name, [o.name]):
            if n in RULES:
                p = RULES[n]
                break
        part_of[o.name] = p
    # Contest rule: no NASA / JPL logos. Paint the decals over with their own background colour.
    # Rectangles: (x0, y0, x1, y1) in pixels from the TOP-LEFT of the original texture, + fill colour.
    import numpy as np
    PATCH = {
        'arm_graphics': [((100, 272, 300, 340), (199, 199, 199))],
        'blade': [((16, 136, 172, 224), (186, 186, 186)), ((890, 398, 1012, 506), (200, 197, 198))],
    }
    REF_SIZE = {'arm_graphics': (512, 512), 'blade': (1024, 512)}
    for img in bpy.data.images:
        key = next((k for k in PATCH if img.name.startswith(k)), None)
        if not key or not img.size[0]:
            continue
        w, h = img.size
        sx, sy = w / REF_SIZE[key][0], h / REF_SIZE[key][1]
        px = np.empty(w * h * 4, dtype=np.float32)
        img.pixels.foreach_get(px)
        px = px.reshape(h, w, 4)
        for (x0, y0, x1, y1), col in PATCH[key]:
            X0, X1 = int(x0 * sx), int(x1 * sx)
            Y0, Y1 = h - int(y1 * sy), h - int(y0 * sy)          # Blender rows start at the bottom
            c = [((v / 255) ** 2.2 if not img.colorspace_settings.is_data and img.colorspace_settings.name == 'Linear Rec.709' else v / 255) for v in col]
            px[Y0:Y1, X0:X1, :3] = c
        img.pixels.foreach_set(px.ravel())
        img.update()
        img.pack()
        print('logo removed from texture', img.name)
    for o in list(meshes):     # the skinned helper of the mast animation
        if o.name.startswith('bottom.001'):
            bpy.data.objects.remove(o, do_unlink=True)
    meshes = [o for o in scene.objects if o.type == 'MESH']

# ---- join per part
groups = {}
for o in meshes:
    groups.setdefault(part_of.get(o.name, 'body'), []).append(o)
for part, objs in groups.items():
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    if len(objs) > 1:
        bpy.ops.object.join()
    j = bpy.context.view_layer.objects.active
    j.name = part
    j.data.name = 'geo'

final = [o for o in scene.objects if o.type == 'MESH']
if MODE != 'pioneer10':
    lo, _ = bounds(final)
    for o in final:
        o.data.transform(Matrix.Translation((0, 0, -lo.z)))
lo, hi = bounds(final)
print('PARTS', sorted(o.name for o in final))
print('BOUNDS app (x, y-up, z):', [round(v, 3) for v in (lo.x, lo.z, -hi.y)], [round(v, 3) for v in (hi.x, hi.z, -lo.y)])
for o in sorted(final, key=lambda o: o.name):
    l2, h2 = bounds([o])
    c = (l2 + h2) / 2
    print(f'  {o.name:28s} tris={len(o.data.polygons):6d} centre_app=({c.x:.3f}, {c.z:.3f}, {-c.y:.3f}) min=({l2.x:.2f},{l2.z:.2f},{-h2.y:.2f}) max=({h2.x:.2f},{h2.z:.2f},{-l2.y:.2f})')

bpy.ops.export_scene.gltf(
    filepath=OUT, export_format='GLB', export_animations=False, export_skins=False, export_morph=False,
    export_apply=True, export_yup=True, export_image_format='WEBP', export_image_webp_fallback=False,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=7,
    export_draco_position_quantization=14, export_draco_normal_quantization=10, export_draco_texcoord_quantization=12,
)
print('WROTE', OUT)
