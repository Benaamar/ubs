# Guide de dépannage

## Erreur : "Impossible de joindre le serveur"

### Causes possibles :

1. **Le backend n'est pas démarré**
   ```bash
   cd backend
   npm start
   ```

2. **Localtunnel n'est pas actif**
   ```bash
   cd backend
   npx localtunnel --port 3000
   ```

3. **Mauvaise URL dans Vercel**
   - Vérifiez que `VITE_API_URL` sur Vercel correspond à l'URL localtunnel actuelle
   - L'URL localtunnel change à chaque redémarrage

## Erreur CORS : "No 'Access-Control-Allow-Origin' header"

### Solution :
1. Assurez-vous que le backend a été mis à jour avec la nouvelle configuration CORS
2. Redémarrez le backend :
   ```bash
   cd backend
   npm start
   ```

## Le frontend ne se connecte pas au backend local

### Vérifications :

1. **Le backend est-il accessible ?**
   ```bash
   curl http://localhost:3000/health
   ```
   
   Devrait retourner : `{"success":true,"status":"OK",...}`

2. **Le fichier `.env` est-il configuré ?**
   ```bash
   cd frontend
   cat .env
   ```
   
   Devrait contenir : `VITE_API_URL=http://localhost:3000`

3. **Le serveur Vite a-t-il rechargé ?**
   - Arrêtez Vite (Ctrl+C)
   - Supprimez le cache : `rm -rf node_modules/.vite`
   - Redémarrez : `npm run dev`

## Le déploiement Vercel échoue

### Erreur : "vite: command not found"

**Solution** : Vite doit être dans `dependencies`, pas `devDependencies`

Vérifiez `frontend/package.json` :
```json
{
  "dependencies": {
    "vite": "^5.0.8",
    "@vitejs/plugin-react": "^4.2.1"
  }
}
```

## MongoDB : Erreur de connexion

### Vérifications :

1. **MongoDB est-il démarré ?**
   ```bash
   # Windows
   net start MongoDB
   
   # Linux/Mac
   sudo systemctl start mongod
   ```

2. **L'URI est-elle correcte ?**
   Vérifiez `backend/.env` :
   ```
   MONGODB_URI=mongodb://localhost:27017/bank-management
   ```

## Localtunnel : "Tunnel Unavailable"

### Solutions :

1. **Redémarrer localtunnel**
   ```bash
   # Arrêtez l'ancien (Ctrl+C)
   npx localtunnel --port 3000
   ```

2. **Utiliser un sous-domaine personnalisé**
   ```bash
   npx localtunnel --port 3000 --subdomain mon-backend-ubs
   ```

3. **Passer à ngrok (plus stable)**
   ```bash
   ngrok http 3000
   ```

## Tests de diagnostic

### Test 1 : Backend local
```bash
curl http://localhost:3000/health
```

### Test 2 : Login local
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@bank.com","password":"demo123"}'
```

### Test 3 : Backend via tunnel
```bash
curl https://votre-url.loca.lt/health \
  -H "bypass-tunnel-reminder: true"
```

## Logs utiles

### Voir les logs du backend :
- Les logs s'affichent dans le terminal où `npm start` a été lancé

### Voir les logs du frontend :
- Ouvrez la console du navigateur (F12)
- Onglet "Console" pour les logs JavaScript
- Onglet "Network" pour les requêtes HTTP

## Besoin d'aide supplémentaire ?

1. Vérifiez les logs dans la console du navigateur
2. Vérifiez les logs du backend dans le terminal
3. Assurez-vous que toutes les dépendances sont installées :
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

