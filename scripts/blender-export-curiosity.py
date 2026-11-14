import bpy, mathutils, math, json, re, sys
argv = sys.argv[sys.argv.index('--') + 1:]
OUT, REPORT = argv[0], argv[1]
sc = bpy.context.scene
PARTS = [  # same order as src/data/vehicles/curiosity.ts
 ('mmrtg', ['mmrtg','rtg','generator','nuclear','power']),
 ('six-wheels', ['wheel','roue','rocker','bogie','suspension','leg']),
 ('robotic-arm', ['arm','bras','turret','tourelle','apxs']),
 ('drill', ['drill','foret','percu','bit']),
 ('mahli', ['mahli','hand.?lens','loupe']),
 ('chemcam', ['chemcam','laser','rmi']),
 ('mastcam', ['mast','mastcam','navcam','head','rsm']),
 ('sam', ['sam','sample.?analysis','oven','four']),
 ('chemin', ['chemin','x.?ray','diffract']),
 ('rems-weather', ['rems','boom','weather','meteo']),
 ('rad', ['rad','radiation']),
 ('antennas', ['hga','high.?gain','uhf','antenna','antenne','dish']),
]
def match(name):
    n = name.lower()
    for pid, pats in PARTS:
        if n == pid or any(re.search(p, n) for p in pats): return pid
    return None

# 0. freeze: no animation / drivers / constraints overriding transforms
anim = [o.name for o in sc.objects if o.animation_data]
for o in sc.objects:
    o.animation_data_clear()
    for c in list(o.constraints): o.constraints.remove(c)
print('ANIM', len(anim), anim[:8], 'frame', sc.frame_current)
# 0b. glTF-compatible materials: Diffuse BSDF -> Principled BSDF (keep image textures)
for img in bpy.data.images:
    print('IMG', img.name, 'packed', bool(img.packed_file), 'has_data', img.has_data, img.filepath)
for m in bpy.data.materials:
    if not m.use_nodes: continue
    nt = m.node_tree
    for d in [n for n in nt.nodes if n.type == 'BSDF_DIFFUSE']:
        p = nt.nodes.new('ShaderNodeBsdfPrincipled')
        p.inputs['Metallic'].default_value = 0.15
        p.inputs['Roughness'].default_value = 0.65
        p.inputs['Base Color'].default_value = d.inputs['Color'].default_value
        for l in list(nt.links):
            if l.to_node == d and l.to_socket.name == 'Color': nt.links.new(l.from_socket, p.inputs['Base Color'])
            if l.from_node == d: nt.links.new(p.outputs['BSDF'], l.to_socket)
        nt.nodes.remove(d)
    for p in [n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED']:
        p.inputs['Metallic'].default_value = min(p.inputs['Metallic'].default_value, 0.3)
# 1. remove cameras & lights
for o in list(sc.objects):
    if o.type in ('CAMERA', 'LIGHT'): bpy.data.objects.remove(o, do_unlink=True)
# 2. helper pivot cubes (*_p): keep transform, drop geometry
emptied = []
for o in sc.objects:
    if o.type == 'MESH' and o.name.endswith('_p'):
        o.data = bpy.data.meshes.new(o.name + '_empty'); emptied.append(o.name)
# hidden objects?
hidden = [o.name for o in sc.objects if o.hide_render or o.hide_get()]
# 3. orient (front -Y -> +X), ground, centre
top = [o for o in sc.objects if o.parent is None]
holder = bpy.data.objects.new('curiosity', None); sc.collection.objects.link(holder)
for o in top:
    mw = o.matrix_world.copy(); o.parent = holder; o.matrix_world = mw
root = [holder]
holder.matrix_world = mathutils.Matrix.Rotation(math.radians(90), 4, 'Z')
bpy.context.view_layer.update()
def bbox(objs):
    mn = mathutils.Vector((1e9,)*3); mx = mathutils.Vector((-1e9,)*3); any_=False
    for o in objs:
        if o.type != 'MESH' or len(o.data.vertices) == 0: continue
        any_=True
        for c in o.bound_box:
            w = o.matrix_world @ mathutils.Vector(c)
            mn = mathutils.Vector(map(min, mn, w)); mx = mathutils.Vector(map(max, mx, w))
    return (mn, mx) if any_ else None
mn, mx = bbox(sc.objects)
T = mathutils.Matrix.Translation((-(mn.x+mx.x)/2, -(mn.y+mx.y)/2, -mn.z))
for o in root: o.matrix_world = T @ o.matrix_world
bpy.context.view_layer.update()
mn, mx = bbox(sc.objects)
# 4. part bboxes (same claim logic as the app) in glTF coords (x, z, -y)
claims = {}
def walk(o, inherited):
    own = match(o.name); pid = own if own and own != inherited else None
    cur = pid or inherited
    if cur: claims.setdefault(cur, []).append(o)
    for c in o.children: walk(c, cur)
for o in root: walk(o, None)
toG = lambda v: [round(v.x,3), round(v.z,3), round(-v.y,3)]
parts = {}
for pid, objs in claims.items():
    b = bbox(objs)
    if not b: continue
    c = (b[0]+b[1])/2; top = mathutils.Vector((c.x, c.y, b[1].z))
    parts[pid] = {'center': toG(c), 'top': toG(top), 'size': [round(b[1].x-b[0].x,3), round(b[1].z-b[0].z,3), round(b[1].y-b[0].y,3)], 'nodes': [o.name for o in objs][:6]}
# 5. export
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=False, export_apply=True, export_yup=True,
    export_cameras=False, export_lights=False, export_animations=False, export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_image_format='JPEG', export_jpeg_quality=82)
json.dump({'size_m': toG(mx-mn), 'bbox_min': toG(mn), 'bbox_max': toG(mx), 'emptied': emptied, 'hidden': hidden, 'parts': parts, 'unmatched_parts': [p for p,_ in PARTS if p not in parts]}, open(REPORT,'w'), indent=1)
print('EXPORTED', OUT)
