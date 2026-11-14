# 3D models

The site loads `models/<id>.glb` automatically when present, otherwise it shows the built-in procedural model
(nothing breaks). Ids: `apollo11lm`, `lrv`, `sojourner`, `opportunity`, `curiosity`, `pioneer10`.

## From SolidWorks (.SLDPRT / .SLDASM) to .glb

Browsers cannot read SolidWorks files. Export them:

1. Open the **assembly** (.SLDASM) with all its part files present (an assembly alone only references its parts).
2. **File → Save As**:
   - if your version lists **glTF Binary (*.glb)**, choose it → done;
   - otherwise choose **STL (*.stl)** → *Options*: Output as **Binary**, Resolution **Fine**, unit **Meters**,
     tick **"Save all components of an assembly in a single file"** unchecked to keep one file per part
     (part names = file names), or **STEP (*.step)** for one file.
3. In **Blender** (free): File → Import → STL (or STEP via an add-on) → rename each object after the part id
   (`six-wheels`, `solar-panel`, `descent-engine`, `mastcam`… see `src/data/vehicles/<id>.ts` → `meshNames`)
   → scale to **metres**, **+Y up**, front of the vehicle toward **+X**, wheels on the ground at Y = 0
   → File → Export → **glTF 2.0 (.glb)** with **Compression (Draco)** ticked.
4. Name it `<id>.glb` (e.g. `curiosity.glb`), keep it **under 5 MB**, put it in this folder.
5. Check the mapping: `npm run inspect-glb -- public/models/curiosity.glb`

SolidWorks source files (*.SLDPRT, *.SLDASM) are ignored by git — keep them on your machine.
