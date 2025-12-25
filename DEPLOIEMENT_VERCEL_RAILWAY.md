# 🚀 Déploiement sur Vercel (Frontend) + Railway (Backend)

Guide complet pour déployer votre application de manière professionnelle et gratuite.

---

## 📋 Prérequis

- Un compte GitHub (gratuit)
- Un compte Vercel (gratuit) : https://vercel.com/signup
- Un compte Railway (gratuit) : https://railway.app/signup
- Un compte MongoDB Atlas (gratuit) : https://www.mongodb.com/cloud/atlas

---

## 🗄️ Étape 1 : Configurer MongoDB Atlas

1. **Créez un compte** sur https://www.mongodb.com/cloud/atlas
2. **Créez un cluster gratuit** (M0 - Free tier)
3. **Créez un utilisateur de base de données** :
   - Username : `ubs-admin` (ou autre)
   - Password : Générez un mot de passe fort
4. **Configurez le réseau** :
   - Cliquez sur "Network Access"
   - Ajoutez une IP : `0.0.0.0/0` (autorise toutes les IPs pour le test)
5. **Obtenez la connection string** :
   - Cliquez sur "Connect" → "Connect your application"
   - Copiez la chaîne de connexion (ex: `mongodb+srv://user:password@cluster.mongodb.net/ubs?retryWrites=true&w=majority`)
   - Remplacez `<password>` par votre mot de passe

---

## 🚂 Étape 2 : Déployer le Backend sur Railway

### 2.1 Créer un projet sur Railway

1. Allez sur https://railway.app
2. Cliquez sur "Start a New Project"
3. Sélectionnez "Deploy from GitHub repo"
4. Autorisez Railway à accéder à votre repository GitHub
5. Sélectionnez votre repository `ubs`
6. Railway détectera automatiquement Node.js

### 2.2 Configurer le projet

1. **Sélectionnez le dossier backend** :
   - Cliquez sur votre service
   - Allez dans "Settings"
   - Dans "Source", sélectionnez le dossier `backend`

2. **Ajoutez les variables d'environnement** :
   - Allez dans "Variables"
   - Ajoutez les variables suivantes :

   ```
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/ubs?retryWrites=true&w=majority
   JWT_SECRET=votre_secret_jwt_tres_securise_et_long
   PORT=3000
   NODE_ENV=production
   ```

   ⚠️ **Important** : Remplacez `user:password` par vos vraies credentials MongoDB

3. **Configurez le build** :
   - Railway détectera automatiquement `package.json`
   - Build Command : `npm install` (automatique)
   - Start Command : `npm start` (automatique)

### 2.3 Obtenir l'URL du backend

1. Une fois le déploiement terminé, Railway vous donnera une URL
2. Exemple : `https://ubs-backend-production.up.railway.app`
3. **Copiez cette URL** - vous en aurez besoin pour le frontend

### 2.4 Configurer CORS dans le backend

Modifiez `backend/server.js` pour autoriser votre domaine Vercel :

```javascript
const cors = require('cors');

const corsOptions = {
  origin: [
    'http://localhost:3001',
    'http://localhost:5173',
    'https://votre-app.vercel.app',  // Remplacez par votre URL Vercel
    'https://*.vercel.app'  // Tous les sous-domaines Vercel
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

**OU** pour autoriser toutes les origines (pour le test) :

```javascript
app.use(cors({
  origin: '*',
  credentials: true
}));
```

---

## ⚡ Étape 3 : Déployer le Frontend sur Vercel

### 3.1 Préparer le frontend

1. **Créez un fichier `.env.production`** dans `frontend/` :

```env
VITE_API_URL=https://votre-backend.railway.app
```

⚠️ Remplacez par l'URL Railway de votre backend

2. **Modifiez `frontend/src/services/api.js`** :

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://votre-backend.railway.app/api',
  headers: {
    'Content-Type': 'application/json'
  }
})
```

### 3.2 Déployer sur Vercel

**Option A : Via Vercel CLI (Recommandé)**

1. **Installez Vercel CLI** :
   ```bash
   npm i -g vercel
   ```

2. **Connectez-vous** :
   ```bash
   vercel login
   ```

3. **Dans le dossier frontend** :
   ```bash
   cd frontend
   vercel
   ```

4. **Suivez les instructions** :
   - Set up and deploy? **Y**
   - Which scope? Sélectionnez votre compte
   - Link to existing project? **N**
   - What's your project's name? `ubs-frontend` (ou autre)
   - In which directory is your code located? `./`
   - Override settings? **N**

5. **Ajoutez la variable d'environnement** :
   ```bash
   vercel env add VITE_API_URL production
   ```
   Entrez : `https://votre-backend.railway.app`

**Option B : Via GitHub (Recommandé pour production)**

1. Allez sur https://vercel.com
2. Cliquez sur "Add New Project"
3. Importez votre repository GitHub
4. **Configurez le projet** :
   - Framework Preset : **Vite**
   - Root Directory : `frontend`
   - Build Command : `npm run build`
   - Output Directory : `dist`
   - Install Command : `npm install`

5. **Ajoutez les variables d'environnement** :
   - Allez dans "Settings" → "Environment Variables"
   - Ajoutez :
     - Name : `VITE_API_URL`
     - Value : `https://votre-backend.railway.app`
     - Environment : Production, Preview, Development

6. Cliquez sur "Deploy"

### 3.3 Obtenir l'URL du frontend

1. Une fois le déploiement terminé, Vercel vous donnera une URL
2. Exemple : `https://ubs-frontend.vercel.app`
3. **Cette URL est permanente** et ne change pas

---

## 🔄 Étape 4 : Mettre à jour CORS dans le backend

Une fois que vous avez l'URL Vercel, mettez à jour `backend/server.js` :

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3001',
    'http://localhost:5173',
    'https://ubs-frontend.vercel.app',  // Votre URL Vercel
    'https://*.vercel.app'
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

Puis **redéployez sur Railway** (push sur GitHub déclenchera automatiquement le redéploiement).

---

## ✅ Étape 5 : Vérification

1. **Testez le backend** :
   - Ouvrez : `https://votre-backend.railway.app/api/auth`
   - Vous devriez voir une réponse JSON

2. **Testez le frontend** :
   - Ouvrez : `https://votre-frontend.vercel.app`
   - Essayez de vous connecter avec `demo@bank.com` / `demo123`

3. **Vérifiez les logs** :
   - Railway : Dashboard → Votre service → "Deployments" → "View Logs"
   - Vercel : Dashboard → Votre projet → "Deployments" → Cliquez sur un déploiement

---

## 🔧 Configuration des fichiers

### `backend/server.js` (CORS)

```javascript
const cors = require('cors');

const corsOptions = {
  origin: [
    'http://localhost:3001',
    'http://localhost:5173',
    'https://votre-frontend.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

### `frontend/src/services/api.js`

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'https://votre-backend.railway.app'}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
})

// ... reste du code
```

### `frontend/vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001
  }
})
```

---

## 📝 Variables d'environnement

### Railway (Backend)

```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/ubs?retryWrites=true&w=majority
JWT_SECRET=votre_secret_jwt_tres_securise_et_long_minimum_32_caracteres
PORT=3000
NODE_ENV=production
```

### Vercel (Frontend)

```
VITE_API_URL=https://votre-backend.railway.app
```

---

## 🆘 Dépannage

### Erreur CORS
- Vérifiez que l'URL Vercel est dans la liste `origin` de CORS
- Redéployez le backend après modification de CORS

### Erreur de connexion MongoDB
- Vérifiez que votre IP est autorisée dans MongoDB Atlas
- Vérifiez que le mot de passe dans `MONGODB_URI` est correct (sans caractères spéciaux encodés)

### Frontend ne peut pas joindre le backend
- Vérifiez que `VITE_API_URL` est correct dans Vercel
- Vérifiez que le backend est déployé et actif sur Railway
- Testez l'URL backend directement dans le navigateur

### Build échoue sur Vercel
- Vérifiez que `Root Directory` est défini sur `frontend`
- Vérifiez que `package.json` est dans le dossier `frontend`
- Vérifiez les logs de build dans Vercel

---

## 💰 Coûts

- **Vercel** : Gratuit (limite : 100 GB bandwidth/mois)
- **Railway** : Gratuit (limite : $5 de crédit/mois, ~500 heures)
- **MongoDB Atlas** : Gratuit (limite : 512 MB storage)

**Total : 100% gratuit** pour une démonstration client ! 🎉

---

## 🔄 Mises à jour

Chaque fois que vous poussez sur GitHub :
- **Vercel** : Redéploie automatiquement le frontend
- **Railway** : Redéploie automatiquement le backend (si configuré)

---

## 📤 Partager avec votre client

Une fois déployé, partagez simplement l'URL Vercel :
```
https://votre-frontend.vercel.app
```

Cette URL est **permanente** et **professionnelle** ! 🚀

