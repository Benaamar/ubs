# 🔧 Fix Login 401 Error

## 🔍 Problème identifié

Le code retourne une erreur 401 (Unauthorized) lors de la connexion. Cela peut être dû à :

1. ✅ **Bug corrigé** : Le modèle User avait un bug dans le hashing du mot de passe (variable `salt` non définie)
2. ⚠️ **Compte démo corrompu** : Si le compte démo a été créé avec le code bugué, son mot de passe est mal hashé

## ✅ Solutions appliquées

### 1. Correction du bug dans User.js ✅

Le bug dans `backend/models/User.js` a été corrigé :

**Avant (bugué)** :
```javascript
this.password = await bcrypt.hash(this.password, salt); // ❌ salt non défini
```

**Après (corrigé)** :
```javascript
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt); // ✅
```

### 2. Ajout de logs pour debugging ✅

Des logs ont été ajoutés dans le endpoint `/api/auth/login` pour mieux comprendre où le problème se situe.

### 3. Endpoint de reset du compte démo ✅

Un nouvel endpoint a été créé : `POST /api/auth/reset-demo`

## 🚀 Étapes pour résoudre le problème

### Option 1 : Attendre le redéploiement automatique (Recommandé)

1. **Attendez 1-2 minutes** que Vercel redéploie automatiquement le backend
2. **Vérifiez le déploiement** :
   - Allez sur https://vercel.com/dashboard
   - Cliquez sur votre projet backend (`ubsbackend`)
   - Vérifiez que le dernier déploiement est "Ready"

3. **Réinitialisez le compte démo** :
   
   Ouvrez votre navigateur et allez sur :
   ```
   https://ubsbackend.vercel.app/api/auth/reset-demo
   ```
   
   Vous devriez voir :
   ```json
   {
     "success": true,
     "message": "Demo account reset successfully",
     "account": {
       "email": "demo@bank.com",
       "password": "demo123"
     }
   }
   ```

4. **Testez la connexion** :
   - Allez sur https://ubs-nu.vercel.app
   - Connectez-vous avec :
     - Email : `demo@bank.com`
     - Mot de passe : `demo123`

### Option 2 : Vérifier les logs Vercel

1. **Allez sur Vercel Dashboard** : https://vercel.com/dashboard
2. **Cliquez sur votre projet backend** (`ubsbackend`)
3. **Onglet "Deployments"** → Cliquez sur le dernier déploiement
4. **Onglet "Functions"** → Cliquez sur une fonction
5. **Regardez les logs** pour voir les messages de debug :
   ```
   Login attempt for: demo@bank.com
   User found, checking password...
   Password match result: false  ← Si vous voyez ça, le compte doit être réinitialisé
   ```

### Option 3 : Redéployer manuellement sur Vercel

Si le déploiement automatique ne fonctionne pas :

1. **Vercel Dashboard** → Votre projet backend
2. **Onglet "Deployments"**
3. **Cliquez sur les 3 points** du dernier déploiement
4. **"Redeploy"** → Confirmez

## 🧪 Tests après correction

### Test 1 : Vérifier que le backend est déployé

```bash
curl https://ubsbackend.vercel.app/api/auth
```

Devrait retourner :
```json
{
  "success": true,
  "message": "Bank Management API - Authentication",
  "demoAccount": {
    "email": "demo@bank.com",
    "password": "demo123"
  }
}
```

### Test 2 : Réinitialiser le compte démo

```bash
curl -X POST https://ubsbackend.vercel.app/api/auth/reset-demo
```

### Test 3 : Tester le login

```bash
curl -X POST https://ubsbackend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@bank.com","password":"demo123"}'
```

Devrait retourner :
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "email": "demo@bank.com",
    "firstName": "Demo",
    "lastName": "User"
  }
}
```

## 🎯 Résumé rapide

1. ✅ Le bug dans le code a été corrigé
2. ✅ Les changements ont été poussés sur GitHub
3. ⏳ Vercel va redéployer automatiquement (1-2 min)
4. 🔄 Appelez `/api/auth/reset-demo` pour recréer le compte démo
5. ✅ Testez la connexion sur https://ubs-nu.vercel.app

## 🆘 Si ça ne marche toujours pas

### Vérifier les variables d'environnement

Assurez-vous que ces variables sont définies sur Vercel :

1. **Vercel Dashboard** → Projet backend → **Settings** → **Environment Variables**

Variables requises :
- `MONGODB_URI` : Votre URI MongoDB Atlas
- `JWT_SECRET` : Une clé secrète
- `NODE_ENV` : `production`
- `PORT` : `3000`

### Vérifier MongoDB Atlas

1. **MongoDB Atlas** → **Network Access**
2. Vérifiez que `0.0.0.0/0` est autorisé (pour permettre les connexions depuis Vercel)

### Créer un nouveau compte

Si le compte démo ne fonctionne toujours pas, créez un nouveau compte :

1. Allez sur https://ubs-nu.vercel.app
2. Cliquez sur "S'inscrire"
3. Créez un nouveau compte avec vos informations

## 📊 Monitoring

Pour surveiller les logs en temps réel :

1. **Vercel Dashboard** → Projet backend
2. **Deployments** → Dernier déploiement
3. **Functions** → Sélectionnez une fonction
4. Les logs s'affichent en temps réel

Vous verrez maintenant :
```
Login attempt for: demo@bank.com
User found, checking password...
Password match result: true
Login successful for: demo@bank.com
```

## ✅ Confirmation que tout fonctionne

Quand tout est OK, vous devriez pouvoir :
1. ✅ Vous connecter avec `demo@bank.com` / `demo123`
2. ✅ Voir le dashboard avec les statistiques
3. ✅ Créer, modifier, supprimer des clients
4. ✅ Effectuer des opérations bancaires

🎉 Votre application est maintenant complètement fonctionnelle !

