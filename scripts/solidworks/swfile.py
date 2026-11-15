"""
Minimal reader for SolidWorks 2015+ files (.SLDPRT / .SLDASM) — no SolidWorks needed.

It only reads the *display data* SolidWorks caches inside the file (the triangles you see
on screen), not the exact CAD (B-rep) geometry:
  * parts:      "Contents/DisplayLists" -> triangle soups (float32 positions + normals)
  * assemblies: "FaceTessellations/*"   -> triangle strips per part (part-local coordinates)
                + "swXmlContents/COMPINSTANCETREE" (XML) -> 4x4 placement of every component.
Embedded sub-assemblies ("ImportedComp/*.SLDASM") are containers of the same format.

Reverse-engineered for this hackathon; works on the team's files, not guaranteed on every file.
"""
import os, re, struct, zlib
import xml.etree.ElementTree as ET
import numpy as np

MARK = b'\x14\x00\x06\x00\x08\x00'
F3 = re.compile(rb'\x0c\x00\x00\x00\x64\x00\x00\x00\x02\x00\x00\x00')  # float3 array header


def _rol(b, n):
    return ((b << n) | (b >> (8 - n))) & 0xFF


def sections(data: bytes) -> dict:
    """Return {section name: decompressed bytes}. Later duplicates get a '#n' suffix."""
    out, i = {}, 0
    while True:
        p = data.find(MARK, i)
        if p < 0:
            return out
        i = p + 1
        try:
            _, _, cs, us, nl = struct.unpack_from('<5I', data, p + 6)
        except struct.error:
            return out
        if nl == 0 or nl > 400 or cs > len(data):
            continue
        raw = data[p + 26:p + 26 + nl]
        name = None
        for r in range(8):
            t = bytes(_rol(b, r) for b in raw)
            if all(32 <= c < 127 for c in t):
                name = t.decode()
                break
        if name is None:
            continue
        body = data[p + 26 + nl:p + 26 + nl + cs]
        try:
            blob = zlib.decompress(body, -15)
        except zlib.error:
            blob = body
        key, k = name, 1
        while key in out:
            k += 1
            key = f'{name}#{k}'
        out[key] = blob


def biggest(secs: dict, prefix: str):
    c = [v for k, v in secs.items() if k.split('#')[0] == prefix]
    return max(c, key=len) if c else None


def displaylist_bodies(d: bytes):
    """Triangle soups: [(positions Nx3, normals Nx3)] — one per solid body."""
    arrs = []
    for m in F3.finditer(d):
        p = m.start()
        n = struct.unpack_from('<I', d, p + 12)[0]
        if n and p + 16 + n * 12 <= len(d):
            arrs.append((p, n))
    bodies, i = [], 0
    while i < len(arrs) - 1:
        (p, n), (q, m) = arrs[i], arrs[i + 1]
        if m == n and n % 3 == 0 and q == p + 16 + n * 12:
            P = np.frombuffer(d, '<f4', n * 3, p + 16).reshape(n, 3).astype(np.float64)
            N = np.frombuffer(d, '<f4', n * 3, q + 16).reshape(n, 3).astype(np.float64)
            if np.allclose(np.linalg.norm(N, axis=1), 1, atol=1e-2):
                bodies.append((P, N))
                i += 2
                continue
        i += 1
    return bodies


def strip_faces(d: bytes):
    """Face tessellations: [(offset, P, N, tris)] with triangle strips decoded."""
    out = []
    for m in F3.finditer(d):
        p = m.start()
        n = struct.unpack_from('<I', d, p + 12)[0]
        if n < 3:
            continue
        q = p + 16 + n * 12
        if d[q:q + 12] != d[p:p + 12] or struct.unpack_from('<I', d, q + 12)[0] != n:
            continue
        lens = None
        for k in range(1, 400):
            h = p - 16 - 4 * k
            if h < 0:
                break
            if struct.unpack_from('<4I', d, h) == (4, 8, 2, k):
                L = struct.unpack_from(f'<{k}I', d, h + 16)
                if sum(L) == n:
                    lens = L
                break
        if lens is None:
            continue
        T, o = [], 0
        for L in lens:
            for j in range(L - 2):
                T.append((o + j, o + j + 1, o + j + 2) if j % 2 == 0 else (o + j + 1, o + j, o + j + 2))
            o += L
        P = np.frombuffer(d, '<f4', n * 3, p + 16).reshape(n, 3).astype(np.float64)
        N = np.frombuffer(d, '<f4', n * 3, q + 16).reshape(n, 3).astype(np.float64)
        out.append((p, P, N, np.array(T, dtype=np.int64)))
    return out


def _ustrs(d):
    out = []
    for m in re.finditer(rb'\xff\xfe\xff', d):
        p = m.start() + 3
        n = d[p]
        if n == 0xFF:
            n = struct.unpack_from('<H', d, p + 1)[0]
            p += 2
        try:
            out.append((m.start(), d[p + 1:p + 1 + 2 * n].decode('utf-16le')))
        except UnicodeDecodeError:
            pass
    return out


def assembly_part_meshes(secs: dict):
    """{part name: (P, N, tris)} from the FaceTessellations of an assembly (part-local coords)."""
    S = _ustrs(secs['FaceTessellations/Directory'])
    entries = []
    for i in range(len(S) - 1):
        if '@' in S[i][1] and re.fullmatch(r'\d{3}-\d{3}-\d{3}', S[i + 1][1]):
            key = secs['FaceTessellations/Directory'][S[i + 1][0] - 8:S[i + 1][0]]
            entries.append((S[i][1], key, S[i + 1][1]))
    geo = {}
    for f in {e[2] for e in entries}:
        blob = secs[f'FaceTessellations/{f}']
        faces = strip_faces(blob)
        ks = sorted((blob.find(k), s) for s, k, ff in entries if ff == f)
        for i, (off, s) in enumerate(ks):
            end = ks[i + 1][0] if i + 1 < len(ks) else 1 << 62
            name = re.sub(r'-\d+$', '', s.split('/')[-1].split('@')[0])
            sel = [x for x in faces if off <= x[0] < end]
            if not sel:
                continue
            Ps, Ns, Ts, o = [], [], [], 0
            for _, P, N, T in sel:
                Ps.append(P); Ns.append(N); Ts.append(T + o); o += len(P)
            geo[name] = (np.concatenate(Ps), np.concatenate(Ns), np.concatenate(Ts))
    return geo


def comp_tree(secs: dict):
    """[(component name, 4x4 row-vector transform)] of the direct children of an assembly."""
    x = secs.get('swXmlContents/COMPINSTANCETREE')
    if not x:
        return []
    root = ET.fromstring(x)
    out = []
    for c in root.iter():
        if c.tag.endswith('swReference') and c.get('swTransform'):
            M = np.array([float(v) for v in c.get('swTransform').split()]).reshape(4, 4)
            out.append((c.get('swName'), M))
    return out


def assembly_instances(path: str):
    """Flatten an assembly: [(part name, world 4x4, component path)] + {part: mesh}."""
    top = sections(open(path, 'rb').read())
    geo = assembly_part_meshes(top)
    subs = {}
    for k, v in top.items():
        if k.startswith('ImportedComp/') and k.endswith('.SLDASM'):
            subs[k[len('ImportedComp/'):-len('.SLDASM')]] = sections(v)
    inst = []

    def place(name, M, chain):
        if name in subs:
            for cn, cm in comp_tree(subs[name]):
                if cn == name or cn in chain:
                    continue
                place(cn, cm @ M, chain + [cn])
        elif name in geo:
            inst.append((name, M, chain))

    for cn, cm in comp_tree(top):
        place(cn, cm, [cn])
    return inst, geo
