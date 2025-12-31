# ⚠️ Vérification urgente : Variables d'environnement Vercel

## 🔴 Erreur 500 lors de l'inscription

L'erreur 500 signifie généralement que :
1. ❌ MongoDB n'est pas connecté
2. ❌ La variable `MONGODB_URI` n'est pas définie sur Vercel
3. ❌ L'URI MongoDB est incorrecte

## ✅ Vérification immédiate

### 1. Vérifier les variables d'environnement sur Vercel

1. **Allez sur** : https://vercel.com/dashboard
2. **Cliquez sur** : Votre projet backend (`ubsbackend`)
3. **Settings** → **Environment Variables**
4. **Vérifiez que ces variables existent** :

| Variable | Valeur requise | Statut |
|----------|---------------|--------|
| `MONGODB_URI` | `mongodb+srv://...` | ⚠️ **CRITIQUE** |
| `JWT_SECRET` | N'importe quelle chaîne | Recommandé |
| `NODE_ENV` | `production` | Optionnel |

### 2. Si `MONGODB_URI` n'existe pas ou est vide

Vous avez 2 options :

#### Option A : Utiliser MongoDB Atlas (Gratuit, Recommandé) ⭐

1. **Créer un compte MongoDB Atlas** : https://cloud.mongodb.com
2. **Créer un cluster gratuit** (M0)
3. **Database Access** :
   - Créez un utilisateur avec mot de passe
   - Notez le username et password
4. **Network Access** :
   - Ajoutez `0.0.0.0/0` (autoriser toutes les IPs)
5. **Obtenez l'URI** :
   - Cliquez sur "Connect"
   - Choisissez "Connect your application"
   - Copiez l'URI : `mongodb+srv://username:password@cluster.mongodb.net/bank-management?retryWrites=true&w=majority`
   - Remplacez `<password>` par votre mot de passe
   - Remplacez `myFirstDatabase` par `bank-management`

6. **Ajoutez sur Vercel** :
   - Dashboard → Projet backend → Settings → Environment Variables
   - Name: `MONGODB_URI`
   - Value: L'URI que vous avez copié
   - Cliquez sur "Add"

7. **Redéployez** :
   - Deployments → Dernier déploiement → 3 points → Redeploy

#### Option B : Utiliser MongoDB gratuit ailleurs

Alternatives gratuites :
- **MongoDB Atlas** (Recommandé) - 512 MB gratuit
- **Railway** - MongoDB gratuit avec limitations
- **Render** - MongoDB gratuit

### 3. Tester la connexion

Une fois `MONGODB_URI` configuré et redéployé :

```bash
# Test 1 : Health check
curl https://ubsbackend.vercel.app/health

# Devrait retourner :
{
  "success": true,
  "status": "OK",
  "database": "Connected"  ← Vérifiez ça !
}

# Test 2 : Initialiser la base de données
curl https://ubsbackend.vercel.app/api/init

# Devrait retourner :
{
  "success": true,
  "message": "Database initialized successfully",
  "demoAccount": {
    "email": "demo@bank.com",
    "password": "demo123"
  }
}

# Test 3 : S'inscrire
curl -X POST https://ubsbackend.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "test123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

## 🚀 Étapes rapides (5 minutes)

1. ✅ **Créer MongoDB Atlas** (2 min) : https://cloud.mongodb.com
2. ✅ **Copier l'URI MongoDB** (1 min)
3. ✅ **Ajouter sur Vercel** (1 min) : Settings → Environment Variables → `MONGODB_URI`
4. ✅ **Redéployer** (1 min) : Deployments → Redeploy
5. ✅ **Initialiser** : Visiter `https://ubsbackend.vercel.app/api/init`
6. ✅ **Tester** : Se connecter sur https://ubs-nu.vercel.app

## 📊 Vérifier les logs Vercel

Pour voir l'erreur exacte :

1. **Vercel Dashboard** → Projet backend
2. **Deployments** → Dernier déploiement
3. **Functions** → Cliquez sur une fonction
4. **Regardez les logs** pour voir :
   ```
   MongoDB connection error: ...
   ```

## ⚡ Solution temporaire : Créer un compte manuellement

Si vous voulez tester rapidement sans MongoDB Atlas :

1. Utilisez un service MongoDB gratuit temporaire
2. Ou utilisez le endpoint `/api/init` une fois MongoDB configuré

## 🎯 Checklist finale

- [ ] MongoDB Atlas créé
- [ ] URI MongoDB copié
- [ ] Variable `MONGODB_URI` ajoutée sur Vercel
- [ ] Backend redéployé
- [ ] `/api/init` appelé avec succès
- [ ] Inscription fonctionne
- [ ] Login fonctionne

Une fois tout ça fait, votre application sera 100% fonctionnelle ! 🎉

