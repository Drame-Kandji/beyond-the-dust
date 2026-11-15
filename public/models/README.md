# Modèles 3D : comment mettre VOS modèles sur le site

Le site cherche automatiquement ces fichiers dans ce dossier :

| Engin | Nom du fichier attendu |
|---|---|
| Module lunaire Apollo 11 | `apollo11lm.glb` |
| Rover lunaire | `lrv.glb` |
| Sojourner | `sojourner.glb` |
| Opportunity | `opportunity.glb` |
| Curiosity | `curiosity.glb` |
| Pioneer 10 | `pioneer10.glb` |

S'il n'y a pas de fichier `.glb`, le site affiche le modèle construit en code (rien ne casse).
**Un navigateur ne sait pas lire** `.SLDPRT`, `.SLDASM` ni `.blend` : il faut les convertir en `.glb`.

---

## Cas 1 : Vous avez un fichier Blender (`.blend`) → le plus simple

1. Ouvrir le fichier dans **Blender** (gratuit : https://www.blender.org/download/).
2. Menu **File → Export → glTF 2.0 (.glb/.gltf)**.
3. Dans le panneau de droite :
   - **Format** : `glTF Binary (.glb)`
   - **Include → Limit to** : rien de coché (tout exporter)
   - **Transform → +Y Up** : coché
   - **Data → Mesh → Apply Modifiers** : coché
   - **Data → Compression** : coché (réduit la taille)
4. Nommer le fichier exactement comme dans le tableau (ex. `curiosity.glb`) → **Export glTF 2.0**.
5. Mettre le fichier dans ce dossier `public/models/`.

## Cas 2 : Vous avez SolidWorks (`.SLDPRT` / `.SLDASM`)

> Un `.SLDASM` (assemblage) ne contient PAS les pièces : il faut aussi tous les `.SLDPRT` qu'il utilise, dans le même dossier.

1. Ouvrir l'assemblage (ou la pièce) dans SolidWorks.
2. **Fichier → Enregistrer sous…** → Type : **STL (*.stl)** → bouton **Options…** :
   - Format de sortie : **Binaire**
   - Unité : **Millimètres** (le convertisseur passe automatiquement en mètres)
   - Résolution : **Grossière** ou **Fine** (si le fichier final dépasse 5 Mo, choisir Grossière)
   - **Décocher** « Enregistrer tous les composants d'un assemblage dans un seul fichier »
     → SolidWorks crée **un fichier `.stl` par pièce**, nommé comme la pièce.
3. Mettre tous ces `.stl` dans un dossier, par exemple `models-src/sojourner/`.
4. Dans un terminal, à la racine du projet :

   ```bash
   npm run model -- sojourner models-src/sojourner
   ```

   Le script crée `public/models/sojourner.glb` (centré, à l'échelle, compressé) et affiche
   quelles pièces du site il a reconnues.
   Options utiles : `--rotate 90` (tourner pour que l'avant regarde +X), `--zup` (modèle dessiné avec Z vers le haut).

## Pour que les pièces restent cliquables

Le nom de chaque pièce/objet doit contenir un mot reconnu, par exemple `wheel`, `solar`, `mast`, `arm`, `drill`,
`antenna`, `rtg`, `ramp`, `airbag`, `engine`, `leg`, `ladder`, `plaque`… (liste complète : `meshNames` dans
`src/data/vehicles/<engin>.ts`). Renommez les objets dans Blender (double-clic dans la liste à droite) ou les
fichiers `.stl` avant conversion.

Vérifier : `npm run inspect-glb -- public/models/curiosity.glb`

Les fichiers sources (`.SLDPRT`, `.SLDASM`, `.blend`) sont ignorés par git : gardez-les sur votre machine
(de préférence dans `models-src/`, hors de `public/`).

## Fichiers SolidWorks (.SLDPRT / .SLDASM) sans SolidWorks

`npm run sw-models` lit directement les fichiers `Apollo Lunar Module.SLDPRT` et `Sojourner Rover.SLDASM`
(les triangles d'affichage que SolidWorks enregistre dans le fichier) et produit `apollo11lm.glb` et `sojourner.glb`.
Chaque pièce cliquable devient un nœud nommé comme l'`id` de la pièce dans `src/data/vehicles/*.ts`.

- Module lunaire : seul l'**étage de descente** est gardé (l'étage de remontée est reparti en orbite en 1969).
  Les sondes de contact et la plaque sont ajoutées en formes simples.
- Sojourner : les 257 composants de l'assemblage sont replacés avec leurs positions ; caméras et lasers ajoutés à l'avant.
- L'atterrisseur Pathfinder, l'EASEP et le réflecteur laser restent des modèles procéduraux (`model.overlay`).

Le code est dans `scripts/solidworks/` (Python 3 + numpy). Si vous ré-enregistrez les fichiers, relancez la commande.

## Modèles NASA (.glb) : Apollo 11 LM, Pioneer 10, Perseverance

Les fichiers `Apollo Lunar Module.glb`, `Pioneer 10.glb` et `Mars 2020 Perseverance Rover.glb` (ressources 3D NASA)
sont préparés par Blender avec :

```bash
BLENDER=/chemin/vers/blender npm run nasa-models
```

Le script `scripts/blender-prepare-nasa-glb.py` :
- découpe chaque modèle en **pièces cliquables** nommées comme les `id` des pièces (`src/data/vehicles/*.ts`) ;
- met le modèle dans le repère de l'application (+X = avant, +Y = haut, sol à 0) ;
- **Apollo 11** : garde seulement l'étage de descente (resté sur la Lune), reprend sondes, plaque et MESA du modèle SolidWorks
  (`scripts/solidworks/apollo11lm-sw.glb`) ;
- **Pioneer 10** : le fichier NASA est rangé par matériau, il est donc découpé en morceaux puis trié par position ;
- **Perseverance** : fige l'animation au moment où le mât est levé et le bras déployé, et **efface les logos NASA / JPL**
  des textures (règle du concours) ;
- exporte en Draco + textures WebP.

Les fichiers sources (noms avec des espaces) ne sont pas envoyés sur GitHub (`.gitignore`), seulement les versions converties.
