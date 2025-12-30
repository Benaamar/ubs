# 🚀 Déployer le Backend sur Vercel

Ce guide vous montre comment déployer votre backend Node.js/Express sur Vercel en tant que projet séparé.

## ✅ Avantages de cette approche

- ✅ Gratuit et illimité sur Vercel
- ✅ URL permanente (ne change jamais)
- ✅ Déploiement automatique sur push GitHub
- ✅ HTTPS automatique
- ✅ Même compte Vercel que le frontend (pas besoin d'un autre compte)

## 📋 Étapes de déploiement

### 1. Préparer le code (✅ Déjà fait)

Les fichiers suivants ont été créés/configurés :
- ✅ `backend/vercel.json` - Configuration Vercel
- ✅ `backend/.vercelignore` - Fichiers à ignorer
- ✅ `backend/server.js` - CORS configuré pour Vercel

### 2. Pusher les changements sur GitHub

```bash
git add .
git commit -m "Configure backend for Vercel deployment"
git push origin main
```

### 3. Déployer sur Vercel

#### Option A : Via le Dashboard Vercel (Recommandé)

1. **Allez sur https://vercel.com/dashboard**

2. **Cliquez sur "Add New..." → "Project"**

3. **Importez votre repository GitHub**
   - Sélectionnez le repo `ubs`
   - Cliquez sur "Import"

4. **Configurez le projet** :
   - **Project Name** : `ubs-backend` (ou un nom de votre choix)
   - **Framework Preset** : Other
   - **Root Directory** : Cliquez sur "Edit" → Sélectionnez `backend`
   - **Build Command** : Laissez vide
   - **Output Directory** : Laissez vide
   - **Install Command** : `npm install`

5. **Ajoutez les variables d'environnement** :
   
   Cliquez sur "Environment Variables" et ajoutez :

   | Name | Value |
   |------|-------|
   | `MONGODB_URI` | Votre URI MongoDB (voir ci-dessous) |
   | `JWT_SECRET` | Une clé secrète aléatoire (ex: `super-secret-key-123456789`) |
   | `PORT` | `3000` |
   | `NODE_ENV` | `production` |

   **Important** : Pour `MONGODB_URI`, vous avez plusieurs options :
   
   **Option 1** : MongoDB Atlas (Gratuit) ⭐ Recommandé
   ```
   mongodb+srv://username:password@cluster.mongodb.net/bank-management?retryWrites=true&w=majority
   ```
   
   **Option 2** : MongoDB local (via tunnel)
   ```
   Pas recommandé pour la production
   ```

6. **Cliquez sur "Deploy"**

7. **Attendez le déploiement** (environ 1-2 minutes)

8. **Notez votre URL backend** :
   ```
   https://ubs-backend.vercel.app
   ```
   (ou l'URL que Vercel vous donne)

#### Option B : Via CLI

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Aller dans le dossier backend
cd backend

# Déployer
vercel

# Suivre les instructions :
# - Set up and deploy? Yes
# - Which scope? Votre compte
# - Link to existing project? No
# - Project name? ubs-backend
# - Directory? ./
# - Override settings? No

# Déployer en production
vercel --prod
```

### 4. Configurer MongoDB Atlas (Si vous n'avez pas de base de données)

1. **Allez sur https://cloud.mongodb.com**

2. **Créez un compte gratuit**

3. **Créez un cluster** :
   - Sélectionnez "Free Shared" (M0)
   - Choisissez une région proche de vous
   - Cliquez sur "Create Cluster"

4. **Configurez l'accès** :
   - **Database Access** : Créez un utilisateur avec mot de passe
   - **Network Access** : Ajoutez `0.0.0.0/0` pour autoriser toutes les IPs

5. **Obtenez l'URI de connexion** :
   - Cliquez sur "Connect"
   - Choisissez "Connect your application"
   - Copiez l'URI : `mongodb+srv://username:password@cluster...`
   - Remplacez `<password>` par votre mot de passe
   - Remplacez `myFirstDatabase` par `bank-management`

6. **Ajoutez l'URI sur Vercel** :
   - Dashboard → Votre projet backend → Settings → Environment Variables
   - Ajoutez/Modifiez `MONGODB_URI` avec votre URI Atlas

### 5. Mettre à jour le Frontend

1. **Allez sur votre projet frontend sur Vercel**
   - https://vercel.com/dashboard → `ubs` (frontend)

2. **Settings → Environment Variables**

3. **Modifiez `VITE_API_URL`** :
   ```
   https://ubs-backend.vercel.app
   ```
   (Remplacez par l'URL de votre backend)

4. **Redéployez le frontend** :
   - Allez dans "Deployments"
   - Cliquez sur les 3 points du dernier déploiement
   - Sélectionnez "Redeploy"

### 6. Tester

1. **Testez le backend directement** :
   ```
   https://ubs-backend.vercel.app/health
   ```
   
   Devrait retourner :
   ```json
   {
     "success": true,
     "status": "OK",
     "timestamp": "..."
   }
   ```

2. **Testez le frontend** :
   ```
   https://ubs-nu.vercel.app
   ```
   
   Connectez-vous avec :
   - Email : `demo@bank.com`
   - Mot de passe : `demo123`

## 🔧 Configuration avancée

### Domaine personnalisé (optionnel)

Sur Vercel, vous pouvez ajouter un domaine personnalisé :
- Backend : `api.votre-domaine.com`
- Frontend : `app.votre-domaine.com`

### Variables d'environnement supplémentaires

Vous pouvez ajouter d'autres variables selon vos besoins :

```env
# Optionnel
CORS_ORIGIN=https://ubs-nu.vercel.app
MAX_UPLOAD_SIZE=5mb
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

## 📝 Logs et Monitoring

Pour voir les logs de votre backend :
1. Vercel Dashboard → Votre projet backend
2. Onglet "Deployments"
3. Cliquez sur un déploiement
4. Onglet "Functions" pour voir les logs

## ⚠️ Limitations de Vercel pour le backend

- ✅ **Fonctions serverless** : Chaque requête = nouvelle instance
- ⚠️ **Timeout** : 10 secondes max par requête (suffisant pour une API)
- ⚠️ **État** : Pas de stockage persistant entre requêtes (utilisez MongoDB)
- ✅ **Pas de limite de déploiements** pour les projets personnels

Ces limitations sont parfaites pour une API REST comme la vôtre !

## 🆘 Dépannage

### Erreur : "Cannot find module"
- Assurez-vous que toutes les dépendances sont dans `dependencies` (pas `devDependencies`)

### Erreur : "MongoDB connection failed"
- Vérifiez votre `MONGODB_URI`
- Assurez-vous que l'IP `0.0.0.0/0` est autorisée dans MongoDB Atlas

### Erreur CORS
- Le fichier `server.js` a été mis à jour pour accepter les domaines Vercel
- Vérifiez que votre frontend utilise la bonne URL backend

### Le compte démo ne se crée pas
- Les logs sont visibles dans Vercel Dashboard → Functions
- Le compte sera créé au premier démarrage

## 🎉 Résultat final

Architecture déployée :

```
Frontend (Vercel)
https://ubs-nu.vercel.app
          ↓
Backend (Vercel)
https://ubs-backend.vercel.app
          ↓
MongoDB (Atlas)
mongodb+srv://...
```

Tout est sur le cloud, gratuit, et avec URLs permanentes ! 🚀

