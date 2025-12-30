# ⚡ Guide de Déploiement Rapide

Ce guide vous permet de déployer **frontend + backend** sur Vercel en 15 minutes.

## 🎯 Plan de déploiement

```
Frontend (Vercel)          Backend (Vercel)          Database (Atlas)
https://ubs-nu.vercel.app  →  https://ubs-backend...  →  MongoDB Cloud
     ✅ Déjà fait !              ⏳ À faire                ⏳ À faire
```

## 📋 Checklist de déploiement

### Partie 1 : MongoDB Atlas (5 min)

- [ ] **Étape 1** : Créer un compte sur https://cloud.mongodb.com
- [ ] **Étape 2** : Créer un cluster gratuit M0
- [ ] **Étape 3** : Créer un utilisateur (username + password)
- [ ] **Étape 4** : Autoriser l'IP `0.0.0.0/0`
- [ ] **Étape 5** : Copier l'URI de connexion
- [ ] **Étape 6** : Modifier l'URI avec le mot de passe et `/bank-management`

📖 **Guide détaillé** : Voir `MONGODB_ATLAS_SETUP.md`

**Résultat** : URI comme `mongodb+srv://user:pass@cluster.mongodb.net/bank-management?retryWrites=true&w=majority`

---

### Partie 2 : Déployer le Backend sur Vercel (5 min)

- [ ] **Étape 1** : Pusher le code sur GitHub
  ```bash
  git add .
  git commit -m "Configure backend for Vercel"
  git push origin main
  ```

- [ ] **Étape 2** : Aller sur https://vercel.com/dashboard

- [ ] **Étape 3** : Cliquer sur "Add New..." → "Project"

- [ ] **Étape 4** : Importer votre repo `ubs`

- [ ] **Étape 5** : Configurer le projet :
  - Project Name : `ubs-backend`
  - Root Directory : `backend` ⚠️ Important !
  - Build Command : (laisser vide)
  
- [ ] **Étape 6** : Ajouter les variables d'environnement :
  
  | Variable | Valeur |
  |----------|--------|
  | `MONGODB_URI` | Votre URI MongoDB Atlas |
  | `JWT_SECRET` | `super-secret-key-123456789` |
  | `PORT` | `3000` |
  | `NODE_ENV` | `production` |

- [ ] **Étape 7** : Cliquer sur "Deploy" et attendre (~2 min)

- [ ] **Étape 8** : Noter l'URL du backend (ex: `https://ubs-backend-xxx.vercel.app`)

- [ ] **Étape 9** : Tester le backend :
  ```
  https://votre-backend.vercel.app/health
  ```
  
  ✅ Devrait retourner : `{"success":true,"status":"OK",...}`

📖 **Guide détaillé** : Voir `DEPLOY_BACKEND_VERCEL.md`

---

### Partie 3 : Connecter le Frontend au Backend (2 min)

- [ ] **Étape 1** : Aller sur Vercel Dashboard → Projet `ubs` (frontend)

- [ ] **Étape 2** : Settings → Environment Variables

- [ ] **Étape 3** : Modifier `VITE_API_URL` :
  ```
  https://votre-backend.vercel.app
  ```
  (Remplacez par l'URL obtenue à l'étape Partie 2 - Étape 8)

- [ ] **Étape 4** : Supprimer les anciennes variables (si elles existent) :
  - Supprimer l'ancienne valeur localtunnel
  
- [ ] **Étape 5** : Sauvegarder

- [ ] **Étape 6** : Redéployer :
  - Onglet "Deployments"
  - 3 points sur le dernier déploiement
  - "Redeploy"

- [ ] **Étape 7** : Attendre le déploiement (~1 min)

---

### Partie 4 : Test final (2 min)

- [ ] **Étape 1** : Ouvrir https://ubs-nu.vercel.app

- [ ] **Étape 2** : Se connecter avec :
  - Email : `demo@bank.com`
  - Mot de passe : `demo123`

- [ ] **Étape 3** : Vérifier que tout fonctionne :
  - ✅ Login réussi
  - ✅ Dashboard s'affiche
  - ✅ Peut créer un client
  - ✅ Peut ajouter une opération

**🎉 Si tout fonctionne, félicitations ! Votre application est déployée !**

---

## 🔧 Commandes Git rapides

Pour pousser les changements :

```bash
# Voir les changements
git status

# Ajouter tous les fichiers
git add .

# Commiter
git commit -m "Configure backend for Vercel deployment"

# Pousser sur GitHub
git push origin main
```

## 🆘 En cas de problème

### Backend : Erreur 500 ou ne démarre pas

1. Vercel Dashboard → Votre backend → Deployments
2. Cliquez sur le dernier déploiement
3. Onglet "Functions" → Voir les logs
4. Cherchez l'erreur (souvent MongoDB URI incorrect)

### Frontend : "Impossible de joindre le serveur"

1. Vérifiez que le backend est bien déployé et fonctionne :
   ```
   https://votre-backend.vercel.app/health
   ```

2. Vérifiez que `VITE_API_URL` est correct dans les variables d'environnement du frontend

3. Assurez-vous d'avoir redéployé le frontend après avoir changé la variable

### MongoDB : "Authentication failed"

1. Vérifiez que le mot de passe dans l'URI est correct
2. Vérifiez que `0.0.0.0/0` est autorisé dans Network Access
3. Attendez 2-3 minutes après avoir ajouté l'IP

### Voir tous les guides détaillés

- 📖 `MONGODB_ATLAS_SETUP.md` - Configuration MongoDB
- 📖 `DEPLOY_BACKEND_VERCEL.md` - Déploiement backend détaillé
- 📖 `TROUBLESHOOTING.md` - Guide de dépannage complet

## 🎯 Architecture finale

```
┌─────────────────────────────────────────────────────────┐
│                    UTILISATEUR                           │
└────────────────────┬────────────────────────────────────┘
                     │ https://
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Frontend (Vercel)                                       │
│  https://ubs-nu.vercel.app                              │
│  - React + Vite                                         │
│  - Interface utilisateur                                │
└────────────────────┬────────────────────────────────────┘
                     │ VITE_API_URL
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Backend (Vercel)                                        │
│  https://ubs-backend-xxx.vercel.app                     │
│  - Node.js + Express                                    │
│  - API REST                                             │
│  - Authentification JWT                                 │
└────────────────────┬────────────────────────────────────┘
                     │ MONGODB_URI
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Database (MongoDB Atlas)                                │
│  mongodb+srv://...mongodb.net/bank-management           │
│  - Collections: users, clients, operations              │
│  - Stockage cloud                                       │
└─────────────────────────────────────────────────────────┘
```

## ✨ Avantages de cette architecture

- ✅ **100% Gratuit** (MongoDB M0 + Vercel Free)
- ✅ **URLs permanentes** (plus de changement d'URL)
- ✅ **HTTPS automatique** (sécurisé)
- ✅ **Déploiement automatique** (push → deploy)
- ✅ **Scalable** (peut gérer plus de trafic)
- ✅ **Monitoring** (logs et métriques sur Vercel)
- ✅ **Backups** (MongoDB Atlas fait des sauvegardes)

## 🚀 Prochaines étapes (optionnel)

Une fois déployé, vous pouvez :

1. **Ajouter un domaine personnalisé** :
   - Frontend : `app.votre-domaine.com`
   - Backend : `api.votre-domaine.com`

2. **Configurer des notifications** :
   - Vercel peut vous notifier par email/Slack en cas d'erreur

3. **Ajouter des analytics** :
   - Vercel Analytics pour suivre les visiteurs

4. **Optimiser les performances** :
   - Activer la compression
   - Configurer le caching

Bonne chance avec votre déploiement ! 🎉

