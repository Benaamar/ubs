# 🚀 Alternative à Ngrok : LocalTunnel (Fonctionne sur Windows ARM)

Si Ngrok ne fonctionne pas sur votre système (Windows ARM64), utilisez **LocalTunnel** - c'est gratuit et fonctionne partout !

---

## ✅ Avantages de LocalTunnel

- ✅ **Fonctionne sur Windows ARM64** (contrairement à Ngrok)
- ✅ **Gratuit** - Pas besoin de compte
- ✅ **Simple** - Installation via npm
- ✅ **Instantané** - Fonctionne en 1 minute

---

## 📦 Installation

### Étape 1 : Installer LocalTunnel

Ouvrez PowerShell et exécutez :

```powershell
npm install -g localtunnel
```

✅ **Ça devrait fonctionner** même sur Windows ARM64 !

---

## 🚀 Utilisation

### Étape 1 : Lancer le Backend

1. **Ouvrez un terminal PowerShell**

2. **Allez dans le dossier backend** :
   ```powershell
   cd C:\Users\azooz\Desktop\ubs\backend
   ```

3. **Lancez le backend** :
   ```powershell
   npm start
   ```

4. **Vérifiez que ça fonctionne** :
   - Vous devriez voir : `Server running on port 3000`
   - Ouvrez : http://localhost:3000/health
   - Vous devriez voir un JSON avec `"status": "OK"`

5. **✅ Laissez ce terminal ouvert !**

---

### Étape 2 : Lancer LocalTunnel

1. **Ouvrez un NOUVEAU terminal PowerShell** (laissez le premier ouvert)

2. **Lancez LocalTunnel** :
   ```powershell
   lt --port 3000
   ```

3. **LocalTunnel va afficher** :
   ```
   your url is: https://xxxx-xxxx-xxxx.loca.lt
   ```

4. **Copiez l'URL HTTPS** (celle qui commence par `https://`)
   - Exemple : `https://random-name-1234.loca.lt`

5. **✅ Laissez ce terminal ouvert aussi !**

---

### Étape 3 : Configurer Vercel

1. **Allez sur Vercel** : https://vercel.com/dashboard

2. **Sélectionnez votre projet** `ubs-v1`

3. **Allez dans** Settings → Environment Variables

4. **Ajoutez ou modifiez** :
   - **Name** : `VITE_API_URL`
   - **Value** : `https://votre-url.loca.lt`
     - ⚠️ Remplacez par l'URL que LocalTunnel vous a donnée (sans `/api`)
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
- ✅ Terminal 2 : LocalTunnel (`lt --port 3000`)

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
   lt --port 3000
   ```

3. **Copiez la nouvelle URL LocalTunnel** (elle change à chaque redémarrage)

4. **Mettez à jour** `VITE_API_URL` dans Vercel

5. **Redéployez Vercel**

---

## 💡 Astuces

### Obtenir une URL Personnalisée (Optionnel)

LocalTunnel permet de choisir un nom personnalisé :

```powershell
lt --port 3000 --subdomain ubs-backend
```

Cela donnera : `https://ubs-backend.loca.lt`

⚠️ **Note** : Le nom doit être unique. Si quelqu'un l'utilise déjà, essayez un autre nom.

### Voir les Requêtes

LocalTunnel affiche les requêtes dans le terminal. C'est utile pour déboguer !

### Arrêter LocalTunnel

Appuyez sur `Ctrl + C` dans le terminal LocalTunnel pour l'arrêter.

---

## 🐛 Dépannage

### Erreur "port already in use"

**Solution** :
- Vérifiez que le backend est bien lancé sur le port 3000
- Ou changez le port dans `backend/server.js` et utilisez ce port dans LocalTunnel

### L'URL LocalTunnel ne fonctionne pas

**Vérifiez** :
- ✅ Le backend est bien lancé (`npm start`)
- ✅ LocalTunnel est bien lancé (`lt --port 3000`)
- ✅ Vous utilisez l'URL HTTPS (pas HTTP)
- ✅ Les deux terminaux sont ouverts

### Le frontend ne peut pas se connecter

**Vérifiez** :
- ✅ `VITE_API_URL` est correct dans Vercel
- ✅ L'URL LocalTunnel est à jour (elle change à chaque redémarrage)
- ✅ Vercel a été redéployé après modification de la variable

### LocalTunnel demande un compte

**Solution** :
- LocalTunnel est gratuit et ne demande généralement pas de compte
- Si un message apparaît, suivez les instructions (c'est rapide et gratuit)

---

## 📋 Checklist

- [ ] LocalTunnel installé (`npm install -g localtunnel`)
- [ ] Backend lancé localement (`npm start`)
- [ ] Backend accessible sur http://localhost:3000/health
- [ ] LocalTunnel lancé (`lt --port 3000`)
- [ ] URL LocalTunnel copiée
- [ ] Variable `VITE_API_URL` configurée dans Vercel
- [ ] Vercel redéployé
- [ ] Test de connexion réussi

---

## 🎯 Résumé Ultra-Rapide

1. **Installer** : `npm install -g localtunnel`
2. **Terminal 1** : `cd backend && npm start`
3. **Terminal 2** : `lt --port 3000`
4. **Copier URL** : `https://xxxx.loca.lt`
5. **Vercel** : `VITE_API_URL` = URL LocalTunnel → Redéployer
6. **Tester** : Ouvrir app Vercel → Se connecter

---

## 🔄 Comparaison : LocalTunnel vs Ngrok

| Fonctionnalité | LocalTunnel | Ngrok |
|----------------|-------------|-------|
| Windows ARM64 | ✅ Oui | ❌ Non |
| Installation | npm | npm ou téléchargement |
| Gratuit | ✅ Oui | ✅ Oui (avec limitations) |
| URL personnalisée | ✅ Oui (optionnel) | ✅ Oui (plan payant) |
| Simplicité | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

**🎉 LocalTunnel est la solution parfaite pour Windows ARM64 !**

**💡 Note** : Cette solution est parfaite pour une démo. Pour la production, utilisez une plateforme cloud (Render, Cyclic, etc.) une fois qu'elles sont accessibles.

