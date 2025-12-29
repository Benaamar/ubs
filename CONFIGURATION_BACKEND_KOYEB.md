# 🚀 Guide : Déployer le Backend sur Koyeb (Gratuit, Sans Carte)

Koyeb est une excellente alternative à Render qui ne demande **pas de carte bancaire** pour le plan gratuit.

---

## 📋 Prérequis

- ✅ Un compte **GitHub** (gratuit)
- ✅ Un compte **Koyeb** (gratuit) : https://www.koyeb.com/signup
- ✅ Un compte **MongoDB Atlas** (gratuit) : https://www.mongodb.com/cloud/atlas

---

## 🗄️ Étape 1 : Configurer MongoDB Atlas

(Si vous avez déjà fait cette étape pour Render, vous pouvez la sauter)

1. Allez sur https://www.mongodb.com/cloud/atlas
2. Créez un cluster gratuit (M0 FREE)
3. Créez un utilisateur de base de données
4. Autorisez toutes les IPs (0.0.0.0/0) dans Network Access
5. Obtenez la chaîne de connexion MongoDB

---

## 🚀 Étape 2 : Créer un Compte Koyeb

1. Allez sur https://www.koyeb.com/signup
2. Cliquez sur "Sign up with GitHub" (recommandé)
3. Autorisez Koyeb à accéder à votre compte GitHub
4. **✅ Pas besoin de carte bancaire !**

---

## 📦 Étape 3 : Créer une Application sur Koyeb

### 3.1 Créer une nouvelle application

1. Dans le tableau de bord Koyeb, cliquez sur "Create App"
2. Sélectionnez "GitHub" comme source
3. Autorisez Koyeb à accéder à votre repository si nécessaire
4. Sélectionnez votre repository : `Benaamar/ubs-v1` (ou votre repo)

### 3.2 Configurer l'application

**Name** : `ubs-backend` (ou autre nom)

**Region** : Choisissez une région proche (ex: Europe - Paris)

**Branch** : `main` (ou votre branche principale)

**Build Command** : `cd backend && npm install`
   - Koyeb va installer les dépendances dans le dossier backend

**Run Command** : `cd backend && npm start`
   - Koyeb va démarrer le serveur depuis le dossier backend

**Port** : `3000`
   - Le port par défaut de votre application

### 3.3 Configurer les variables d'environnement

Cliquez sur "Environment Variables" et ajoutez :

#### Variable 1 : MONGODB_URI
- **Key** : `MONGODB_URI`
- **Value** : Votre chaîne de connexion MongoDB
  ```
  mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ubs?retryWrites=true&w=majority
  ```

#### Variable 2 : JWT_SECRET
- **Key** : `JWT_SECRET`
- **Value** : Générez une clé secrète
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```

#### Variable 3 : PORT
- **Key** : `PORT`
- **Value** : `3000`

#### Variable 4 : NODE_ENV
- **Key** : `NODE_ENV`
- **Value** : `production`

### 3.4 Choisir le plan

- Sélectionnez **"Nano"** (gratuit)
- ✅ **Pas de carte bancaire requise !**
- Le plan Nano inclut :
  - 512 MB RAM
  - Service toujours actif (ne s'endort pas)
  - Bande passante limitée mais suffisante pour la démo

### 3.5 Déployer

1. Cliquez sur "Deploy"
2. Koyeb va :
   - Cloner votre repository
   - Installer les dépendances
   - Démarrer le serveur
   - ⏱️ **Temps estimé** : 3-5 minutes

---

## ✅ Étape 4 : Vérifier le déploiement

### 4.1 Obtenir l'URL

1. Une fois le déploiement terminé, Koyeb vous donnera une URL
2. Elle ressemble à : `https://ubs-backend-xxxxx.koyeb.app`
3. **Copiez cette URL**

### 4.2 Tester le backend

1. Ouvrez : `https://votre-backend.koyeb.app/health`
2. Vous devriez voir :
   ```json
   {
     "success": true,
     "status": "OK",
     "timestamp": "..."
   }
   ```

### 4.3 Vérifier les logs

1. Dans votre application Koyeb, allez dans "Logs"
2. Vous devriez voir :
   ```
   MongoDB Connected
   ✅ Compte démo créé avec succès!
   Server running on port 3000
   ```

---

## ⚡ Étape 5 : Configurer Vercel

1. Allez dans Vercel → Settings → Environment Variables
2. Ajoutez ou modifiez :
   - **Name** : `VITE_API_URL`
   - **Value** : `https://votre-backend.koyeb.app`
3. Redéployez Vercel

---

## 🎉 Avantages de Koyeb

- ✅ **Gratuit** sans carte bancaire
- ✅ **Service toujours actif** (ne s'endort pas)
- ✅ **Déploiement rapide**
- ✅ **HTTPS automatique**
- ✅ **Logs en temps réel**

---

## 🐛 Dépannage

### Le build échoue

**Vérifiez les Build Settings :**
- Build Command : `cd backend && npm install`
- Run Command : `cd backend && npm start`

### Erreur MongoDB

- Vérifiez que `MONGODB_URI` est correct
- Vérifiez que votre IP est autorisée dans MongoDB Atlas

### Le service ne démarre pas

- Vérifiez les logs dans Koyeb
- Vérifiez que toutes les variables d'environnement sont configurées

---

**🎉 Votre backend est maintenant déployé sur Koyeb, gratuitement et sans carte bancaire !**

