# 🌍 Modèles 3D pour la Carte Spatiale

## 📦 Modèles Requis

Pour que la carte 3D fonctionne correctement, vous devez placer les fichiers suivants dans ce dossier :

### Fichiers Nécessaires

1. **Mars.glb** - Modèle 3D de la planète Mars
2. **Moon.glb** - Modèle 3D de la Lune

## 📁 Structure Attendue

```
public/models/
├── README.md
├── Mars.glb      ← À ajouter
└── Moon.glb      ← À ajouter
```

## 🚀 Instructions

### Option 1 : Copier depuis template/src/models/

Si vous avez les modèles dans `template/src/models/`, copiez-les ici :

```bash
# Windows (CMD)
copy "template\src\models\Mars.glb" "public\models\Mars.glb"
copy "template\src\models\Moon.glb" "public\models\Moon.glb"

# Windows (PowerShell)
Copy-Item "template\src\models\Mars.glb" -Destination "public\models\Mars.glb"
Copy-Item "template\src\models\Moon.glb" -Destination "public\models\Moon.glb"
```

### Option 2 : Télécharger des Modèles

Vous pouvez télécharger des modèles 3D gratuits depuis :

- **NASA 3D Resources** : https://nasa3d.arc.nasa.gov/
- **Sketchfab** : https://sketchfab.com/ (cherchez "Mars" et "Moon")
- **CGTrader** : https://www.cgtrader.com/

**Recommandations** :
- Format : `.glb` (préféré) ou `.gltf`
- Taille : < 5 MB par modèle
- Qualité : Moyenne à haute (pas besoin d'ultra-détails)
- Textures : Incluses dans le fichier GLB

## 🎨 Spécifications Techniques

### Mars.glb
- **Échelle recommandée** : ~1 unité = diamètre de Mars
- **Pivot** : Centre de la planète
- **Textures** : Couleurs martiennes (rouge-orange)
- **Polygones** : 5,000 - 50,000 triangles

### Moon.glb
- **Échelle recommandée** : ~1 unité = diamètre de la Lune
- **Pivot** : Centre de la Lune
- **Textures** : Couleurs lunaires (gris argenté)
- **Polygones** : 3,000 - 30,000 triangles

## 🔧 Ajustement de l'Échelle

Si vos modèles sont trop grands ou trop petits, modifiez l'échelle dans :

**Fichier** : `src/components/hub/SolarMap3D.tsx`

```typescript
// Pour Mars
const scale = 0.7; // Augmentez ou diminuez cette valeur

// Pour la Lune
const scale = 0.25; // Augmentez ou diminuez cette valeur
```

## 🎯 Test sans Modèles

Si les fichiers GLB ne sont pas présents, l'application affichera :
- ⚠️ Une erreur de chargement dans la console
- 🔴 Les sphères basiques à la place (fallback automatique)

## 🌟 Modèles Recommandés (Gratuits)

### Mars - NASA 3D
- **Lien** : https://nasa3d.arc.nasa.gov/detail/mars-viking-mdim21
- **Format** : OBJ (convertir en GLB avec Blender)
- **Qualité** : Excellente
- **Licence** : Domaine public

### Lune - NASA 3D
- **Lien** : https://nasa3d.arc.nasa.gov/detail/moon-8k
- **Format** : OBJ (convertir en GLB)
- **Qualité** : Très haute
- **Licence** : Domaine public

## 🛠️ Conversion OBJ → GLB

Si vous avez des fichiers OBJ, convertissez-les avec :

### Option 1 : En ligne (gratuit)
- **gltf.report** : https://gltf.report/
- Glissez-déposez votre fichier OBJ
- Téléchargez le GLB résultant

### Option 2 : Blender (gratuit)
1. Ouvrir Blender
2. File → Import → Wavefront (.obj)
3. File → Export → glTF 2.0 (.glb)
4. Options : Format = GLB, Include = Textures

## ✅ Vérification

Une fois les fichiers ajoutés :

1. Relancer l'application : `npm run dev`
2. Naviguer vers le Hub
3. Activer le mode 3D
4. Mars et la Lune devraient apparaître avec les modèles 3D

## 🐛 Dépannage

### Erreur "Failed to load Mars.glb"
- Vérifiez que le fichier existe : `public/models/Mars.glb`
- Vérifiez les permissions de lecture
- Vérifiez que le format est bien GLB

### Modèle trop grand/petit
- Ajustez la valeur `scale` dans SolarMap3D.tsx

### Modèle noir ou sans texture
- Vérifiez que les textures sont incluses dans le GLB
- Essayez d'ajouter plus de lumières dans la scène

### Performance faible
- Réduisez le nombre de polygones (< 20,000)
- Utilisez des textures plus petites (< 2048x2048)

## 📚 Ressources Supplémentaires

- **Three.js GLTF Loader** : https://threejs.org/docs/#examples/en/loaders/GLTFLoader
- **Drei useGLTF** : https://github.com/pmndrs/drei#usegltf
- **Optimiser GLB** : https://gltf.report/

---

**Note** : Les modèles 3D amélioreront considérablement le réalisme de votre carte spatiale ! 🚀✨
