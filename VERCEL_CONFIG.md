# Configuration Vercel

## Variables d'environnement à configurer sur Vercel

Pour que votre application Vercel puisse se connecter au backend localtunnel, vous devez configurer les variables d'environnement suivantes :

### Étapes :

1. **Allez sur Vercel Dashboard** : https://vercel.com/dashboard
2. **Sélectionnez votre projet** : `ubs`
3. **Allez dans Settings** → **Environment Variables**
4. **Ajoutez la variable suivante** :

```
Name: VITE_API_URL
Value: https://chilly-bees-fix.loca.lt
```

5. **Cliquez sur Save**
6. **Redéployez l'application** :
   - Allez dans l'onglet **Deployments**
   - Cliquez sur les 3 points (...) du dernier déploiement
   - Sélectionnez **Redeploy**

## ⚠️ Important

L'URL localtunnel change à chaque redémarrage. Vous devrez mettre à jour cette variable chaque fois que vous redémarrez localtunnel.

### URL actuelle :
```
https://chilly-bees-fix.loca.lt
```

### Comment obtenir la nouvelle URL :
```bash
cd backend
npx localtunnel --port 3000
# La nouvelle URL sera affichée : your url is: https://xxx-xxx.loca.lt
```

## Alternative recommandée : Déployer le backend

Pour éviter de changer l'URL constamment, je recommande de déployer le backend sur Railway, Render, ou Heroku.

### Option Railway (Gratuit) :

1. Créez un compte sur https://railway.app/
2. Créez un nouveau projet
3. Connectez votre repo GitHub
4. Sélectionnez le dossier `backend`
5. Ajoutez les variables d'environnement :
   - `MONGODB_URI` : Votre URI MongoDB
   - `JWT_SECRET` : Une clé secrète aléatoire
   - `PORT` : 3000

Railway vous donnera une URL permanente comme : `https://votre-app.railway.app`

Ensuite, configurez `VITE_API_URL` sur Vercel avec cette URL Railway.

