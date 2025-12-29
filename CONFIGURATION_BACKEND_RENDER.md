# 🚀 Guide Complet : Configurer le Backend sur Render

Ce guide vous explique comment déployer et configurer votre backend UBS sur Render pour qu'il fonctionne avec votre frontend Vercel.

---

## 📋 Prérequis

Avant de commencer, vous devez avoir :
- ✅ Un compte **GitHub** (gratuit)
- ✅ Un compte **Render** (gratuit) : https://render.com/signup
- ✅ Un compte **MongoDB Atlas** (gratuit) : https://www.mongodb.com/cloud/atlas

---

## 🗄️ Étape 1 : Configurer MongoDB Atlas

### 1.1 Créer un compte MongoDB Atlas

1. Allez sur https://www.mongodb.com/cloud/atlas
2. Cliquez sur "Try Free" ou "Sign Up"
3. Créez votre compte (email + mot de passe)

### 1.2 Créer un cluster gratuit

1. Une fois connecté, cliquez sur "Build a Database"
2. Choisissez le plan **"M0 FREE"** (gratuit)
3. Sélectionnez un **Cloud Provider** (AWS recommandé)
4. Choisissez une **région** proche de vous (ex: Europe - Ireland)
5. Cliquez sur "Create"

⏱️ **Attendez 3-5 minutes** que le cluster soit créé

### 1.3 Créer un utilisateur de base de données

1. Dans votre cluster, cliquez sur "Database Access" (Accès à la base de données)
2. Cliquez sur "Add New Database User"
3. Configurez :
   - **Authentication Method** : Password
   - **Username** : `ubs-admin` (ou autre nom)
   - **Password** : Cliquez sur "Autogenerate Secure Password" ou créez-en un
   - ⚠️ **IMPORTANT** : Copiez et sauvegardez ce mot de passe quelque part !
   - **Database User Privileges** : "Read and write to any database"
4. Cliquez sur "Add User"

### 1.4 Configurer l'accès réseau

1. Dans le menu de gauche, cliquez sur "Network Access"
2. Cliquez sur "Add IP Address"
3. Cliquez sur "Allow Access From Anywhere" (autoriser toutes les IPs)
   - Cela ajoutera `0.0.0.0/0`
   - ⚠️ Pour la production, vous pouvez restreindre aux IPs de Render
4. Cliquez sur "Confirm"

### 1.5 Obtenir la chaîne de connexion

1. Retournez dans votre cluster
2. Cliquez sur "Connect"
3. Choisissez "Connect your application"
4. Sélectionnez "Node.js" comme driver
5. Copiez la chaîne de connexion qui ressemble à :
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Remplacez** `<username>` par votre nom d'utilisateur (ex: `ubs-admin`)
7. **Remplacez** `<password>` par votre mot de passe
8. **Ajoutez le nom de la base de données** à la fin :
   ```
   mongodb+srv://ubs-admin:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/ubs?retryWrites=true&w=majority
   ```
   (Notez le `/ubs` avant le `?`)

9. **Copiez cette chaîne complète** - vous en aurez besoin pour Render

---

## 🚂 Étape 2 : Déployer le Backend sur Render

### 2.1 Créer un compte Render

1. Allez sur https://render.com/signup
2. Cliquez sur "Get Started for Free"
3. Choisissez "Continue with GitHub" (recommandé)
4. Autorisez Render à accéder à votre compte GitHub

### 2.2 Créer un nouveau Web Service

1. Dans le tableau de bord Render, cliquez sur "New +"
2. Sélectionnez "Web Service"
3. Cliquez sur "Connect account" si GitHub n'est pas connecté
4. Sélectionnez votre repository GitHub : `Benaamar/ubs-v1` (ou votre repo)

### 2.3 Configurer le service

Remplissez les champs suivants :

**Name** : `ubs-backend` (ou autre nom)

**Region** : Choisissez une région proche (ex: Frankfurt, Ireland)

**Branch** : `main` (ou la branche où se trouve votre code)

**Root Directory** : `backend`
   - ⚠️ **IMPORTANT** : Le code backend est dans le dossier `backend/`

**Runtime** : `Node`
   - Render détecte automatiquement Node.js

**Build Command** : `npm install`
   - Render installera automatiquement les dépendances

**Start Command** : `npm start`
   - Cela exécutera `node server.js` défini dans `package.json`

### 2.4 Configurer les variables d'environnement

Avant de déployer, cliquez sur "Advanced" et ajoutez les variables d'environnement :

Cliquez sur "Add Environment Variable" et ajoutez :

#### Variable 1 : MONGODB_URI
- **Key** : `MONGODB_URI`
- **Value** : Collez la chaîne de connexion MongoDB que vous avez copiée à l'étape 1.5
  ```
  mongodb+srv://ubs-admin:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/ubs?retryWrites=true&w=majority
  ```

#### Variable 2 : JWT_SECRET
- **Key** : `JWT_SECRET`
- **Value** : Générez une clé secrète longue et complexe
  - Vous pouvez utiliser cette commande dans votre terminal :
    ```bash
    node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
    ```
  - Ou créez une phrase complexe : `UBS_Bank_Management_2025_Super_Secret_Key_!@#$%^&*`

#### Variable 3 : PORT
- **Key** : `PORT`
- **Value** : `3000`
  - Render définit automatiquement le PORT, mais c'est une bonne pratique de le spécifier

#### Variable 4 : NODE_ENV
- **Key** : `NODE_ENV`
- **Value** : `production`

### 2.5 Choisir le plan

- Sélectionnez **"Free"** pour commencer (gratuit)
- ⚠️ **IMPORTANT - Carte Bancaire** : 
  - Render peut demander une carte bancaire pour **vérifier votre identité**
  - **Vous ne serez PAS facturé** sur le plan gratuit
  - Une autorisation temporaire de $1 USD peut apparaître, mais sera **annulée automatiquement**
  - C'est juste une vérification de sécurité, pas un paiement réel
  - Si vous ne voulez pas ajouter de carte, utilisez **Koyeb** (voir `CONFIGURATION_BACKEND_KOYEB.md`)
- ⚠️ **Note** : Le plan gratuit met le service en "sleep" après 15 min d'inactivité
- Pour la production, considérez le plan "Starter" ($7/mois) qui ne s'endort jamais

### 2.6 Déployer

1. Cliquez sur "Create Web Service"
2. Render va :
   - Cloner votre repository
   - Installer les dépendances (`npm install`)
   - Démarrer le serveur (`npm start`)
   - ⏱️ **Temps estimé** : 5-10 minutes

3. **Suivez les logs** en temps réel pour voir la progression

---

## ✅ Étape 3 : Vérifier le déploiement

### 3.1 Vérifier les logs

1. Dans votre service Render, allez dans l'onglet "Logs"
2. Vous devriez voir :
   ```
   MongoDB Connected
   ✅ Compte démo créé avec succès!
   📧 Email: demo@bank.com
   🔑 Mot de passe: demo123
   Server running on port 3000
   ```

### 3.2 Obtenir l'URL du backend

1. Une fois le déploiement terminé, Render vous donnera une URL
2. Elle ressemble à : `https://ubs-backend.onrender.com`
3. **Copiez cette URL** - vous en aurez besoin pour Vercel

### 3.3 Tester le backend

1. Ouvrez votre navigateur
2. Allez sur : `https://votre-backend.onrender.com/health`
3. Vous devriez voir :
   ```json
   {
     "success": true,
     "status": "OK",
     "timestamp": "2025-01-XX..."
   }
   ```

4. Testez l'endpoint d'authentification :
   ```
   https://votre-backend.onrender.com/api/auth
   ```
   Vous devriez voir une réponse JSON

---

## 🔧 Étape 4 : Configurer CORS pour autoriser Vercel

### 4.1 Modifier server.js

Le fichier `backend/server.js` autorise déjà toutes les origines (`origin: '*'`), ce qui est bien pour commencer.

Si vous voulez restreindre aux domaines spécifiques, modifiez `backend/server.js` :

```javascript
app.use(cors({
  origin: [
    'http://localhost:3001',
    'http://localhost:5173',
    'https://ubs-huit-henné.vercel.app',
    'https://*.vercel.app'  // Tous les sous-domaines Vercel
  ],
  credentials: true
}));
```

### 4.2 Redéployer après modification

1. Si vous modifiez `server.js`, poussez les changements sur GitHub
2. Render redéploiera automatiquement
3. Ou allez dans Render → Manual Deploy → Deploy latest commit

---

## ⚡ Étape 5 : Configurer Vercel pour se connecter au backend

### 5.1 Ajouter la variable d'environnement dans Vercel

1. Allez sur votre projet Vercel : https://vercel.com/dashboard
2. Cliquez sur votre projet `ubs-v1`
3. Allez dans **Settings** → **Environment Variables**
4. Cliquez sur "Add New"
5. Configurez :
   - **Name** : `VITE_API_URL`
   - **Value** : `https://votre-backend.onrender.com`
     - ⚠️ Remplacez par votre vraie URL Render (sans `/api` à la fin)
   - **Environments** : Cochez **Production**, **Preview**, et **Development**
6. Cliquez sur "Save"

### 5.2 Redéployer Vercel

1. Allez dans **Deployments**
2. Cliquez sur les trois points (⋯) du dernier déploiement
3. Sélectionnez "Redeploy"
4. Attendez la fin du déploiement

---

## 🧪 Étape 6 : Tester la connexion complète

### 6.1 Tester depuis le navigateur

1. Ouvrez votre application Vercel : `https://ubs-huit-henné.vercel.app`
2. Essayez de vous connecter :
   - Email : `demo@bank.com`
   - Mot de passe : `demo123`
3. Si la connexion fonctionne → ✅ Tout est configuré correctement !

### 6.2 Vérifier les erreurs

Si vous voyez des erreurs dans la console du navigateur (F12) :

**Erreur CORS :**
- Vérifiez que CORS est configuré dans `backend/server.js`
- Vérifiez que l'URL Vercel est dans la liste des origines autorisées

**Erreur de connexion :**
- Vérifiez que `VITE_API_URL` est correctement configuré dans Vercel
- Vérifiez que le backend Render est actif (pas en "sleep")
- Testez l'URL du backend directement : `https://votre-backend.onrender.com/health`

**Erreur MongoDB :**
- Vérifiez que `MONGODB_URI` est correct dans Render
- Vérifiez que votre IP est autorisée dans MongoDB Atlas
- Vérifiez les logs Render pour voir les erreurs de connexion

---

## 📊 Gérer le Backend après Déploiement

### Voir les logs

1. Allez dans votre service Render
2. Cliquez sur l'onglet "Logs"
3. Vous verrez tous les logs en temps réel

### Redéployer

**Méthode automatique :**
- Chaque push sur GitHub redéploie automatiquement

**Méthode manuelle :**
1. Allez dans votre service Render
2. Cliquez sur "Manual Deploy"
3. Sélectionnez "Deploy latest commit"

### Modifier les variables d'environnement

1. Allez dans votre service Render
2. Cliquez sur "Environment"
3. Modifiez ou ajoutez des variables
4. Render redémarrera automatiquement le service

---

## 🐛 Dépannage

### Le backend ne démarre pas

**Vérifiez les logs Render :**
- Erreur MongoDB → Vérifiez `MONGODB_URI`
- Erreur de port → Vérifiez que `PORT` est défini
- Erreur de dépendances → Vérifiez que `package.json` est correct

### Le backend est en "sleep"

**Sur le plan gratuit :**
- Le service s'endort après 15 min d'inactivité
- Le premier appel prend 30-50 secondes pour "réveiller" le service
- C'est normal sur le plan gratuit

**Solution :**
- Utilisez un service de "ping" gratuit (ex: UptimeRobot) pour maintenir le service actif
- Ou passez au plan Starter ($7/mois) qui ne s'endort jamais

### Erreur de connexion MongoDB

1. Vérifiez que le mot de passe dans `MONGODB_URI` est correct (sans caractères spéciaux encodés)
2. Vérifiez que votre IP est autorisée dans MongoDB Atlas (Network Access)
3. Vérifiez que l'utilisateur de la base de données existe et a les bonnes permissions

### Le frontend ne peut pas se connecter au backend

1. Vérifiez que `VITE_API_URL` est correct dans Vercel
2. Vérifiez que le backend est actif (pas en sleep)
3. Vérifiez CORS dans `backend/server.js`
4. Testez l'URL backend directement : `https://votre-backend.onrender.com/health`

---

## 📋 Checklist Complète

Avant de considérer le backend comme fonctionnel :

- [ ] Compte MongoDB Atlas créé
- [ ] Cluster MongoDB créé et actif
- [ ] Utilisateur de base de données créé
- [ ] Accès réseau configuré (0.0.0.0/0)
- [ ] Chaîne de connexion MongoDB obtenue
- [ ] Compte Render créé
- [ ] Web Service créé sur Render
- [ ] Root Directory configuré sur `backend`
- [ ] Variables d'environnement configurées (MONGODB_URI, JWT_SECRET, PORT, NODE_ENV)
- [ ] Déploiement réussi
- [ ] Backend accessible via URL Render
- [ ] Test `/health` fonctionne
- [ ] CORS configuré pour autoriser Vercel
- [ ] Variable `VITE_API_URL` configurée dans Vercel
- [ ] Frontend redéployé avec la nouvelle variable
- [ ] Test de connexion depuis le frontend réussi

---

## 💰 Coûts

### Plan Gratuit (Recommandé pour commencer)
- **Render** : Gratuit (service s'endort après 15 min)
- **MongoDB Atlas** : Gratuit (512 MB storage)
- **Total** : $0/mois

### Plan Production
- **Render Starter** : $7/mois (service toujours actif)
- **MongoDB Atlas M10** : $9/mois (10 GB storage)
- **Total** : ~$16/mois

---

**🎉 Une fois toutes ces étapes complétées, votre backend sera fonctionnel et connecté à votre frontend !**

