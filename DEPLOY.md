# Déployer Beyond the Dust sur Vercel — guide pas à pas

Durée : environ 10 minutes. Coût : gratuit (offre *Hobby*).
Le site est 100 % statique : aucune base de données, aucune clé API, aucune variable d'environnement.

---

## Méthode A — Depuis le site Vercel (recommandée)

### 1. Créer le compte
1. Aller sur **https://vercel.com/signup**.
2. Choisir **Continue with GitHub** et se connecter avec le compte **Drame-Kandji** (le propriétaire du dépôt).
3. Choisir l'offre **Hobby** (gratuite).

### 2. Importer le dépôt
1. Sur le tableau de bord, cliquer **Add New… → Project**.
2. Dans *Import Git Repository*, trouver **naza-space-app** → **Import**.
   - S'il n'apparaît pas : cliquer **Adjust GitHub App Permissions**, autoriser le dépôt `naza-space-app`, puis revenir.

### 3. Vérifier la configuration (normalement rien à changer)
Vercel lit le fichier `vercel.json` du dépôt :

| Champ | Valeur |
|---|---|
| Framework Preset | **Vite** |
| Root Directory | `./` |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Environment Variables | *(aucune)* |

Option : dans *Project Name*, mettre `beyond-the-dust` pour obtenir l'adresse `https://beyond-the-dust.vercel.app` (si le nom est libre).

### 4. Déployer
1. Cliquer **Deploy**.
2. Attendre 1 à 2 minutes (étapes : *Installing → Building → Deploying*).
3. Vercel affiche **Congratulations!** et l'adresse publique, par exemple `https://beyond-the-dust.vercel.app`.

### 5. Déploiements automatiques
À partir de maintenant, **chaque `git push` sur `main` redéploie automatiquement le site** (en 1 à 2 minutes).
L'avancement est visible dans l'onglet **Deployments**.

---

## Méthode B — En ligne de commande (alternative)

```bash
npm i -g vercel          # installer l'outil
vercel login             # se connecter (choisir GitHub)
vercel                   # premier déploiement : répondre aux questions
                         #   Set up and deploy? → Y
                         #   Link to existing project? → N
                         #   Project name → beyond-the-dust
                         #   Directory → ./   (les réglages sont lus dans vercel.json)
vercel --prod            # publier en production
```

---

## 6. Vérifier le site en ligne (obligatoire avant la soumission)

Le jury ne doit avoir **besoin d'aucun compte** pour ouvrir le lien.

- [ ] Ouvrir le lien dans une **fenêtre de navigation privée** (déconnecté de tout compte).
- [ ] Le tester sur **un téléphone** (4G si possible) et sur un ordinateur.
- [ ] Intro → carte → Mars → Opportunity → toucher 3 pièces → **Leave** : aucune erreur.
- [ ] Le son fonctionne : bouton **Hear the story** (EN) puis passer en **FR** et réessayer.
- [ ] Les liens utiles fonctionnent :
  - `…/#/machine/opportunity`, `…/#/machine/pioneer10`, `…/#/machine/lrv`
  - `…/#/teachers`, `…/#/sources`
  - `…/?lang=fr` (site en français)
  - `…/?demo=1` (séquence automatique de 30 s pour la vidéo, touche **R** pour rejouer)
- [ ] (Si casque Meta Quest) ouvrir le lien dans le navigateur du casque → **Live it in VR**. La VR exige HTTPS : c'est le cas sur Vercel.

## 7. Mettre le lien partout
1. Dans **SUBMISSION.md** : remplacer `[Public website URL]` par l'adresse Vercel.
2. Dans le **README.md** : ajouter en haut la ligne `**Live demo:** https://…vercel.app`.
3. Sur la page GitHub du dépôt : roue dentée ⚙️ à côté de *About* → champ **Website** → coller l'adresse.
4. Sur la page de soumission Space Apps : rubrique **Final Project** (et **Project Demo** pour la vidéo).
5. `git add -A && git commit -m "Add live demo link" && git push`

---

## Dépannage

| Problème | Solution |
|---|---|
| Le build échoue sur une erreur TypeScript | Lancer `npm run build` en local, corriger, puis `git push`. Les logs sont dans *Deployments → (le déploiement) → Building*. |
| Erreur de version de Node | *Settings → General → Node.js Version* → choisir **20.x** ou **22.x**, puis *Redeploy*. |
| « The deployment was blocked » ou l'auteur du commit n'est pas reconnu | Ajouter l'email Git (`git config user.email`) au compte GitHub (*Settings → Emails*), ou rendre le dépôt public. |
| Le dépôt n'apparaît pas dans l'import | *Adjust GitHub App Permissions* → autoriser `naza-space-app`. |
| Le son ne marche pas | Toucher l'écran une fois (les navigateurs bloquent le son avant un geste), vérifier que le téléphone n'est pas en mode silencieux. Sans MP3, la voix du navigateur prend le relais. |
| La 3D est lente sur un vieux téléphone | Normal : la qualité baisse automatiquement. `?no3d=1` force le mode 2D. |
| Une page renvoie 404 | Utiliser les adresses avec `#/…` (le site utilise des routes en hash, aucune configuration serveur n'est nécessaire). |
| Revenir à une version précédente | *Deployments* → choisir un ancien déploiement → **⋯ → Promote to Production**. |

## Nom de domaine personnalisé (optionnel)
*Project → Settings → Domains → Add* → saisir le domaine → suivre les instructions DNS affichées par Vercel.
