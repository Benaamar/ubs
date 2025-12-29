# 🚀 Solution Rapide : Utiliser Ngrok pour la Démo (5 Minutes)

Si les plateformes cloud ne fonctionnent pas, utilisez **Ngrok** pour exposer votre backend local. **Parfait pour une démo immédiate !**

---

## ✅ Avantages de Ngrok

- ✅ **Instantané** - Fonctionne en 2 minutes
- ✅ **Gratuit** - Pas besoin de compte pour commencer
- ✅ **Simple** - Juste 2 commandes
- ✅ **Fonctionne toujours** - Pas de problème DNS ou de région

---

## 📋 Prérequis

- ✅ Node.js installé sur votre PC
- ✅ Votre backend fonctionne localement
- ✅ MongoDB Atlas configuré (ou MongoDB local)

---

## 🚀 Étapes Rapides

### Étape 1 : Lancer le Backend Localement

1. **Ouvrez PowerShell** (ou CMD)

2. **Allez dans le dossier backend** :
   ```powershell
   cd C:\Users\azooz\Desktop\ubs\backend
   ```

3. **Installez les dépendances** (si pas déjà fait) :
   ```powershell
   npm install
   ```

4. **Créez un fichier `.env`** dans le dossier `backend/` :
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ubs?retryWrites=true&w=majority
   JWT_SECRET=votre_cle_secrete_tres_longue_et_complexe
   PORT=3000
   NODE_ENV=development
   ```
   ⚠️ Remplacez par vos vraies valeurs MongoDB

5. **Lancez le backend** :
   ```powershell
   npm start
   ```

6. **Vérifiez que ça fonctionne** :
   - Vous devriez voir : `Server running on port 3000`
   - Ouvrez : http://localhost:3000/health
   - Vous devriez voir un JSON avec `"status": "OK"`

7. **✅ Laissez ce terminal ouvert !**

---

### Étape 2 : Installer et Lancer Ngrok

1. **Ouvrez un NOUVEAU terminal PowerShell** (laissez le premier ouvert)

2. **Installez Ngrok** :
   ```powershell
   npm install -g ngrok
   ```
   
   **OU** téléchargez depuis : https://ngrok.com/download
   - Extrayez le fichier
   - Ajoutez le chemin au PATH Windows

3. **Lancez Ngrok** :
   ```powershell
   ngrok http 3000
   ```

4. **Ngrok va afficher** :
   ```
   Forwarding  https://xxxx-xxxx-xxxx.ngrok-free.app -> http://localhost:3000
   ```
   
5. **Copiez l'URL HTTPS** (celle qui commence par `https://`)
   - Exemple : `https://abcd-1234-5678.ngrok-free.app`

6. **✅ Laissez ce terminal ouvert aussi !**

---

### Étape 3 : Configurer Vercel

1. **Allez sur Vercel** : https://vercel.com/dashboard

2. **Sélectionnez votre projet** `ubs-v1`

3. **Allez dans** Settings → Environment Variables

4. **Ajoutez ou modifiez** :
   - **Name** : `VITE_API_URL`
   - **Value** : `https://votre-url.ngrok-free.app`
     - ⚠️ Remplacez par l'URL que Ngrok vous a donnée (sans `/api`)
   - **Environments** : Production, Preview, Development

5. **Sauvegardez**

6. **Redéployez Vercel** :
   - Deployments → Trois points (⋯) → Redeploy

---

### Étape 4 : Tester

1. **Ouvrez votre app Vercel** : `https://ubs-huit-henné.vercel.app`

2. **Testez la connexion** :
   - Email : `demo@bank.com`
   - Mot de passe : `demo123`

3. **✅ Si ça fonctionne** → Votre démo est prête !

---

## ⚠️ Important : Garder les Terminaux Ouverts

**Vous devez garder OUVERT** :
- ✅ Terminal 1 : Backend (`npm start`)
- ✅ Terminal 2 : Ngrok (`ngrok http 3000`)

Si vous fermez l'un des deux, l'application ne fonctionnera plus.

---

## 🔄 Pour Redémarrer Plus Tard

1. **Terminal 1** :
   ```powershell
   cd C:\Users\azooz\Desktop\ubs\backend
   npm start
   ```

2. **Terminal 2** :
   ```powershell
   ngrok http 3000
   ```

3. **Copiez la nouvelle URL Ngrok** (elle change à chaque redémarrage)

4. **Mettez à jour** `VITE_API_URL` dans Vercel

5. **Redéployez Vercel**

---

## 💡 Astuces

### Obtenir une URL Fixe (Optionnel)

Le plan gratuit de Ngrok change l'URL à chaque redémarrage. Pour une URL fixe :

1. Créez un compte gratuit sur https://ngrok.com
2. Obtenez votre authtoken
3. Configurez : `ngrok config add-authtoken VOTRE_TOKEN`
4. Utilisez : `ngrok http 3000 --domain=votre-domaine.ngrok-free.app`

### Voir les Requêtes

Ngrok affiche toutes les requêtes en temps réel dans le terminal. C'est très utile pour déboguer !

### Arrêter Ngrok

Appuyez sur `Ctrl + C` dans le terminal Ngrok pour l'arrêter.

---

## 🐛 Dépannage

### Erreur "port already in use"

**Solution** :
- Vérifiez que le backend est bien lancé sur le port 3000
- Ou changez le port dans `backend/server.js` et utilisez ce port dans Ngrok

### L'URL Ngrok ne fonctionne pas

**Vérifiez** :
- ✅ Le backend est bien lancé (`npm start`)
- ✅ Ngrok est bien lancé (`ngrok http 3000`)
- ✅ Vous utilisez l'URL HTTPS (pas HTTP)
- ✅ Les deux terminaux sont ouverts

### Le frontend ne peut pas se connecter

**Vérifiez** :
- ✅ `VITE_API_URL` est correct dans Vercel
- ✅ L'URL Ngrok est à jour (elle change à chaque redémarrage)
- ✅ Vercel a été redéployé après modification de la variable

### Ngrok demande un compte

**Solution** :
- Créez un compte gratuit sur https://ngrok.com
- C'est gratuit et prend 30 secondes
- Vous obtiendrez un authtoken à configurer

---

## 📋 Checklist

- [ ] Backend lancé localement (`npm start`)
- [ ] Backend accessible sur http://localhost:3000/health
- [ ] Ngrok installé
- [ ] Ngrok lancé (`ngrok http 3000`)
- [ ] URL Ngrok copiée
- [ ] Variable `VITE_API_URL` configurée dans Vercel
- [ ] Vercel redéployé
- [ ] Test de connexion réussi

---

## 🎯 Résumé Ultra-Rapide

1. **Terminal 1** : `cd backend && npm start`
2. **Terminal 2** : `ngrok http 3000`
3. **Copier URL Ngrok** : `https://xxxx.ngrok-free.app`
4. **Vercel** : `VITE_API_URL` = URL Ngrok → Redéployer
5. **Tester** : Ouvrir app Vercel → Se connecter

---

**🎉 Votre démo est maintenant accessible en ligne, même si les plateformes cloud ne fonctionnent pas !**

**💡 Note** : Cette solution est parfaite pour une démo, mais pour la production, utilisez une plateforme cloud (Render, Cyclic, etc.) une fois qu'elles sont accessibles.

