# 🆓 Alternatives Gratuites pour Déployer le Backend (Sans Carte Bancaire)

Si Koyeb ne fonctionne pas, voici plusieurs alternatives gratuites pour déployer votre backend.

---

## 🎯 Option 1 : Cyclic.sh (Recommandé - Le Plus Simple)

Cyclic.sh est spécialement conçu pour les applications Node.js et est **100% gratuit sans carte bancaire**.

### Avantages
- ✅ Gratuit sans carte bancaire
- ✅ Service toujours actif (ne s'endort pas)
- ✅ Déploiement automatique depuis GitHub
- ✅ HTTPS automatique
- ✅ Très simple à utiliser

### Étapes

1. **Créez un compte** : https://www.cyclic.sh
   - Cliquez sur "Sign up with GitHub"
   - Autorisez l'accès

2. **Créez une nouvelle application** :
   - Cliquez sur "New App"
   - Sélectionnez votre repository : `Benaamar/ubs-v1`
   - Cliquez sur "Connect"

3. **Configurez l'application** :
   - **Root Directory** : `backend`
   - **Branch** : `main`
   - Cyclic détecte automatiquement Node.js

4. **Ajoutez les variables d'environnement** :
   - Cliquez sur "Environment Variables"
   - Ajoutez :
     - `MONGODB_URI` = votre chaîne MongoDB
     - `JWT_SECRET` = votre clé secrète
     - `PORT` = `3000`
     - `NODE_ENV` = `production`

5. **Déployez** :
   - Cliquez sur "Deploy"
   - Cyclic déploiera automatiquement
   - ⏱️ Temps : 2-3 minutes

6. **Obtenez l'URL** :
   - Cyclic vous donnera une URL : `https://votre-app.cyclic.app`
   - Utilisez cette URL dans `VITE_API_URL` sur Vercel

---

## 🚀 Option 2 : Fly.io (Gratuit avec Limites)

Fly.io offre un plan gratuit généreux sans carte bancaire pour commencer.

### Avantages
- ✅ Plan gratuit généreux
- ✅ Service toujours actif
- ✅ Déploiement via CLI ou GitHub
- ✅ Global CDN

### Étapes

1. **Créez un compte** : https://fly.io/app/sign-up
   - Utilisez votre email ou GitHub

2. **Installez Fly CLI** :
   ```bash
   # Windows (PowerShell)
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

3. **Créez un fichier `fly.toml`** dans le dossier `backend/` :
   ```toml
   app = "ubs-backend"
   primary_region = "cdg"  # Paris

   [build]

   [http_service]
     internal_port = 3000
     force_https = true
     auto_stop_machines = false
     auto_start_machines = true
     min_machines_running = 1
     processes = ["app"]

   [[services]]
     http_checks = []
     internal_port = 3000
     processes = ["app"]
     protocol = "tcp"
     script_checks = []
   ```

4. **Déployez** :
   ```bash
   cd backend
   fly launch
   fly secrets set MONGODB_URI="votre_chaîne_mongodb"
   fly secrets set JWT_SECRET="votre_clé_secrète"
   fly secrets set NODE_ENV="production"
   fly deploy
   ```

5. **Obtenez l'URL** : `https://ubs-backend.fly.dev`

---

## 🔄 Option 3 : Back4app (Gratuit)

Back4app est une plateforme backend-as-a-service qui offre un plan gratuit.

### Avantages
- ✅ Gratuit sans carte
- ✅ Interface simple
- ✅ MongoDB inclus

### Étapes

1. **Créez un compte** : https://www.back4app.com
2. **Créez une nouvelle application**
3. **Configurez MongoDB** (ou utilisez leur base de données)
4. **Déployez votre code** via leur interface

---

## 💻 Option 4 : Solution Locale avec Ngrok (Pour Démo Rapide)

Si vous voulez juste montrer une démo rapidement sans déployer, utilisez votre PC local avec Ngrok.

### Avantages
- ✅ Instantané
- ✅ Gratuit
- ✅ Parfait pour une démo en direct

### Inconvénients
- ❌ Nécessite que votre PC soit allumé
- ❌ L'URL change à chaque redémarrage (plan gratuit)

### Étapes

1. **Lancez votre backend localement** :
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Installez Ngrok** :
   - Téléchargez : https://ngrok.com/download
   - Ou via npm : `npm install -g ngrok`

3. **Lancez Ngrok** :
   ```bash
   ngrok http 3000
   ```

4. **Copiez l'URL** que Ngrok vous donne (ex: `https://abcd-123.ngrok-free.app`)

5. **Configurez Vercel** :
   - Variable `VITE_API_URL` = `https://votre-url.ngrok-free.app`

6. **⚠️ Important** : Gardez les deux terminaux ouverts (backend + ngrok)

---

## 🎁 Option 5 : Railway (Avec Crédit Gratuit)

Railway offre souvent des crédits gratuits pour commencer.

### Avantages
- ✅ Interface moderne
- ✅ Déploiement automatique
- ✅ Crédit gratuit au départ

### Inconvénients
- ⚠️ Peut demander une carte après épuisement du crédit

### Étapes

1. **Créez un compte** : https://railway.app
2. **Créez un nouveau projet**
3. **Connectez GitHub**
4. **Sélectionnez votre repository**
5. **Configurez** :
   - Root Directory : `backend`
   - Variables d'environnement
6. **Déployez**

---

## 📊 Comparaison des Options

| Plateforme | Carte | Gratuit | Actif 24/7 | Simplicité |
|------------|-------|---------|------------|------------|
| **Cyclic.sh** | ❌ Non | ✅ Oui | ✅ Oui | ⭐⭐⭐⭐⭐ |
| **Fly.io** | ❌ Non* | ✅ Oui | ✅ Oui | ⭐⭐⭐ |
| **Back4app** | ❌ Non | ✅ Oui | ✅ Oui | ⭐⭐⭐⭐ |
| **Ngrok** | ❌ Non | ✅ Oui | ⚠️ PC allumé | ⭐⭐⭐⭐⭐ |
| **Railway** | ⚠️ Après crédit | ✅ Oui | ✅ Oui | ⭐⭐⭐⭐ |

*Fly.io peut demander une carte après un certain usage, mais le plan gratuit est généreux

---

## 🎯 Recommandation : Cyclic.sh

**Pourquoi Cyclic.sh ?**
- ✅ Le plus simple à utiliser
- ✅ Spécialement conçu pour Node.js
- ✅ Gratuit sans carte bancaire
- ✅ Service toujours actif
- ✅ Déploiement en 2-3 minutes

---

## 📝 Guide Rapide Cyclic.sh

### 1. Créer le compte
```
https://www.cyclic.sh → Sign up with GitHub
```

### 2. Créer l'application
```
New App → Sélectionner votre repo → Connect
```

### 3. Configurer
```
Root Directory: backend
Variables: MONGODB_URI, JWT_SECRET, PORT, NODE_ENV
```

### 4. Déployer
```
Deploy → Attendre 2-3 minutes
```

### 5. Obtenir l'URL
```
https://votre-app.cyclic.app
```

### 6. Configurer Vercel
```
VITE_API_URL = https://votre-app.cyclic.app
```

---

## 🆘 Si Aucune Option Ne Fonctionne

### Solution Temporaire : Utiliser Ngrok

1. Lancez votre backend localement
2. Utilisez Ngrok pour exposer le port 3000
3. Configurez Vercel avec l'URL Ngrok
4. **Parfait pour une démo immédiate !**

### Solution Long Terme : Render avec Carte

Si vous avez vraiment besoin d'une solution stable :
- Render avec carte (vérification uniquement, pas de paiement)
- Ou passez au plan Starter ($7/mois) pour un service professionnel

---

## ✅ Checklist Rapide

Pour chaque option, vous devez :
- [ ] Créer un compte
- [ ] Connecter GitHub
- [ ] Configurer Root Directory = `backend`
- [ ] Ajouter variables d'environnement
- [ ] Déployer
- [ ] Tester l'URL `/health`
- [ ] Configurer `VITE_API_URL` dans Vercel

---

**🎉 Essayez Cyclic.sh en premier - c'est le plus simple et le plus fiable !**

