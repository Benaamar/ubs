# Déployer le Backend sur Railway

Railway est une plateforme gratuite pour déployer des applications Node.js avec MongoDB.

## Étapes de déploiement :

### 1. Créer un compte Railway

1. Allez sur https://railway.app/
2. Connectez-vous avec GitHub

### 2. Créer un nouveau projet

1. Cliquez sur **New Project**
2. Sélectionnez **Deploy from GitHub repo**
3. Choisissez votre repository `ubs`

### 3. Configurer le service

1. Railway détectera automatiquement le backend
2. Si ce n'est pas le cas, spécifiez le **Root Directory** : `backend`

### 4. Ajouter MongoDB

1. Dans votre projet Railway, cliquez sur **+ New**
2. Sélectionnez **Database** → **Add MongoDB**
3. Railway créera automatiquement une base de données MongoDB

### 5. Configurer les variables d'environnement

Dans les **Settings** de votre service backend, ajoutez :

```env
MONGODB_URI=${{MongoDB.MONGO_URL}}
JWT_SECRET=votre_secret_aleatoire_ici_123456789
PORT=3000
NODE_ENV=production
```

**Note** : `${{MongoDB.MONGO_URL}}` est une référence automatique à votre MongoDB Railway.

### 6. Déployer

1. Railway déploiera automatiquement
2. Vous obtiendrez une URL comme : `https://backend-production-xxxx.up.railway.app`

### 7. Mettre à jour Vercel

1. Allez sur Vercel Dashboard
2. Mettez à jour `VITE_API_URL` avec votre URL Railway
3. Redéployez le frontend

## ✅ Avantages

- ✅ URL permanente (ne change jamais)
- ✅ MongoDB hébergé inclus
- ✅ Déploiement automatique sur push GitHub
- ✅ HTTPS automatique
- ✅ Gratuit pour les petits projets

## 🔧 Fichier de configuration Railway

Le fichier `railway.json` est déjà configuré dans le dossier backend.

## 📝 Variables d'environnement finales

Une fois Railway configuré, votre configuration Vercel sera :

```
VITE_API_URL=https://votre-backend.up.railway.app
```

Cette URL ne changera jamais ! 🎉

