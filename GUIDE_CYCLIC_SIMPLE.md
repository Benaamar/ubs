# 🚀 Guide Simple : Déployer le Backend sur Cyclic.sh (5 Minutes)

Guide étape par étape pour déployer votre backend UBS sur Cyclic.sh - **100% gratuit, sans carte bancaire**.

---

## ✅ Prérequis

- ✅ Votre code est sur GitHub (repository `Benaamar/ubs-v1`)
- ✅ Vous avez configuré MongoDB Atlas (voir `CONFIGURATION_BACKEND_RENDER.md` étape 1)
- ✅ Vous avez votre chaîne de connexion MongoDB

---

## 📝 Étape 1 : Créer un Compte Cyclic.sh

1. **Allez sur** : https://www.cyclic.sh
2. **Cliquez sur** "Sign up" ou "Get Started"
3. **Choisissez** "Sign up with GitHub" (recommandé)
4. **Autorisez** Cyclic.sh à accéder à votre compte GitHub
5. **✅ C'est fait !** Pas besoin de carte bancaire

---

## 📦 Étape 2 : Créer une Nouvelle Application

1. **Dans le tableau de bord Cyclic**, cliquez sur **"New App"** ou **"Create App"**

2. **Sélectionnez votre repository GitHub** :
   - Vous verrez la liste de vos repositories
   - Cherchez `Benaamar/ubs-v1` (ou votre nom de repo)
   - **Cliquez dessus**

3. **Cliquez sur "Connect"** ou "Deploy"

---

## ⚙️ Étape 3 : Configurer l'Application

### 3.1 Configuration de base

Cyclic va détecter automatiquement Node.js. Vous devez juste configurer :

**Root Directory** :
- Cliquez sur "Settings" ou "Configure"
- Trouvez "Root Directory" ou "Working Directory"
- **Changez de `./` à `backend`**
- ⚠️ **IMPORTANT** : Le code backend est dans le dossier `backend/`

**Branch** :
- Laissez `main` (ou votre branche principale)

### 3.2 Variables d'environnement

1. **Allez dans "Environment Variables"** ou "Env Vars"

2. **Cliquez sur "Add Variable"** et ajoutez :

#### Variable 1 : MONGODB_URI
- **Key** : `MONGODB_URI`
- **Value** : Votre chaîne de connexion MongoDB complète
  ```
  mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ubs?retryWrites=true&w=majority
  ```
  ⚠️ Remplacez `username`, `password`, et l'URL par vos vraies valeurs

#### Variable 2 : JWT_SECRET
- **Key** : `JWT_SECRET`
- **Value** : Générez une clé secrète
  - Ouvrez votre terminal PowerShell et tapez :
    ```powershell
    node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
    ```
  - Copiez le résultat et collez-le comme valeur

#### Variable 3 : PORT
- **Key** : `PORT`
- **Value** : `3000`

#### Variable 4 : NODE_ENV
- **Key** : `NODE_ENV`
- **Value** : `production`

3. **Sauvegardez** toutes les variables

---

## 🚀 Étape 4 : Déployer

1. **Cliquez sur "Deploy"** ou "Deploy Now"

2. **Attendez le déploiement** :
   - Cyclic va cloner votre repository
   - Installer les dépendances (`npm install` dans le dossier backend)
   - Démarrer le serveur (`npm start`)
   - ⏱️ **Temps estimé** : 2-5 minutes

3. **Suivez les logs** :
   - Vous verrez la progression en temps réel
   - Attendez de voir "Deployment successful" ou "App is live"

---

## ✅ Étape 5 : Obtenir l'URL et Tester

### 5.1 Obtenir l'URL

1. Une fois le déploiement terminé, Cyclic vous donnera une URL
2. Elle ressemble à : `https://ubs-backend-xxxxx.cyclic.app`
3. **Copiez cette URL** - vous en aurez besoin pour Vercel

### 5.2 Tester le backend

1. **Ouvrez votre navigateur**
2. **Allez sur** : `https://votre-app.cyclic.app/health`
3. **Vous devriez voir** :
   ```json
   {
     "success": true,
     "status": "OK",
     "timestamp": "2025-01-XX..."
   }
   ```

4. **Si ça fonctionne** → ✅ Votre backend est déployé !

### 5.3 Vérifier les logs

1. Dans Cyclic, allez dans l'onglet **"Logs"**
2. Vous devriez voir :
   ```
   MongoDB Connected
   ✅ Compte démo créé avec succès!
   📧 Email: demo@bank.com
   🔑 Mot de passe: demo123
   Server running on port 3000
   ```

---

## ⚡ Étape 6 : Configurer Vercel pour se Connecter au Backend

Maintenant que votre backend est en ligne, connectez-le à votre frontend Vercel :

1. **Allez sur Vercel** : https://vercel.com/dashboard

2. **Sélectionnez votre projet** `ubs-v1`

3. **Allez dans** Settings → Environment Variables

4. **Ajoutez ou modifiez** la variable :
   - **Name** : `VITE_API_URL`
   - **Value** : `https://votre-app.cyclic.app`
     - ⚠️ Remplacez par votre vraie URL Cyclic (sans `/api` à la fin)
   - **Environments** : Cochez **Production**, **Preview**, et **Development**

5. **Sauvegardez**

6. **Redéployez Vercel** :
   - Allez dans "Deployments"
   - Cliquez sur les trois points (⋯) du dernier déploiement
   - Sélectionnez "Redeploy"
   - Attendez la fin du déploiement

---

## 🧪 Étape 7 : Tester la Connexion Complète

1. **Ouvrez votre application Vercel** : `https://ubs-huit-henné.vercel.app`

2. **Essayez de vous connecter** :
   - Email : `demo@bank.com`
   - Mot de passe : `demo123`

3. **Si la connexion fonctionne** → 🎉 **Tout est configuré !**

---

## 🐛 Dépannage

### Le déploiement échoue

**Vérifiez** :
- ✅ Root Directory est bien `backend` (pas `./`)
- ✅ Toutes les variables d'environnement sont configurées
- ✅ La chaîne MongoDB est correcte (vérifiez les logs)

### Erreur MongoDB

**Vérifiez** :
- ✅ `MONGODB_URI` est correct dans Cyclic
- ✅ Votre IP est autorisée dans MongoDB Atlas (Network Access → 0.0.0.0/0)
- ✅ Le mot de passe dans l'URL MongoDB est correct

### Le frontend ne peut pas se connecter

**Vérifiez** :
- ✅ `VITE_API_URL` est configuré dans Vercel avec l'URL Cyclic
- ✅ L'URL Cyclic fonctionne (testez `/health`)
- ✅ Vercel a été redéployé après l'ajout de la variable

### Le service ne démarre pas

**Vérifiez les logs Cyclic** :
- Regardez les erreurs dans l'onglet "Logs"
- Vérifiez que toutes les dépendances sont installées
- Vérifiez que `package.json` est correct dans le dossier `backend/`

---

## 📋 Checklist Complète

Avant de considérer que tout fonctionne :

- [ ] Compte Cyclic.sh créé
- [ ] Application créée et connectée à GitHub
- [ ] Root Directory configuré sur `backend`
- [ ] Variable `MONGODB_URI` ajoutée
- [ ] Variable `JWT_SECRET` ajoutée
- [ ] Variable `PORT` ajoutée
- [ ] Variable `NODE_ENV` ajoutée
- [ ] Déploiement réussi
- [ ] URL Cyclic obtenue
- [ ] Test `/health` fonctionne
- [ ] Variable `VITE_API_URL` configurée dans Vercel
- [ ] Vercel redéployé
- [ ] Test de connexion depuis le frontend réussi

---

## 💡 Astuces

### Voir les logs en temps réel

Dans Cyclic, l'onglet "Logs" montre tout en temps réel. C'est très utile pour déboguer.

### Redéployer après modification

Si vous modifiez le code :
- Poussez sur GitHub
- Cyclic redéploie automatiquement
- Ou allez dans Cyclic → "Redeploy"

### Modifier les variables d'environnement

1. Allez dans "Environment Variables"
2. Modifiez ou ajoutez des variables
3. Cyclic redémarre automatiquement le service

---

## 🎉 Résumé Rapide

1. **Cyclic.sh** → Créer compte → New App → Sélectionner repo
2. **Configurer** → Root Directory = `backend` → Variables d'environnement
3. **Déployer** → Attendre 2-5 minutes
4. **Obtenir URL** → `https://votre-app.cyclic.app`
5. **Vercel** → `VITE_API_URL` = URL Cyclic → Redéployer
6. **Tester** → Ouvrir app Vercel → Se connecter

---

**🎉 Votre backend est maintenant en ligne et gratuit !**

