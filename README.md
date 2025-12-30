# UBS Banking Management System

Système de gestion bancaire UBS - Application complète avec frontend React et backend Node.js.

## 🚀 Déploiement (Architecture Cloud)

```
Frontend (Vercel) → Backend (Vercel) → Database (MongoDB Atlas)
     ✅                  ⏳                    ⏳
```

- **Frontend** : ✅ Déployé sur Vercel - https://ubs-nu.vercel.app
- **Backend** : ⏳ À déployer sur Vercel (guide ci-dessous)
- **Base de données** : ⏳ MongoDB Atlas gratuit

### 📖 Guides de déploiement

#### ⚡ **Guide de démarrage rapide** (15 min)
👉 **[QUICK_START_DEPLOYMENT.md](QUICK_START_DEPLOYMENT.md)** - Déployez tout en 15 minutes !

#### 📚 Guides détaillés

1. **[MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md)** - Configuration MongoDB gratuit (5 min)
2. **[DEPLOY_BACKEND_VERCEL.md](DEPLOY_BACKEND_VERCEL.md)** - Déployer le backend sur Vercel (5 min)
3. **[VERCEL_CONFIG.md](VERCEL_CONFIG.md)** - Configuration des variables d'environnement
4. **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Guide de dépannage complet

#### 🔧 Alternatives (si besoin)

- **[DEPLOY_BACKEND_RAILWAY.md](DEPLOY_BACKEND_RAILWAY.md)** - Alternative : Railway (gratuit mais limité)

## 💻 Développement Local

### Prérequis

- Node.js 16+
- MongoDB (local ou Atlas)
- npm ou yarn

### Installation

1. **Cloner le repo**
   ```bash
   git clone https://github.com/Benaamar/ubs.git
   cd ubs
   ```

2. **Backend**
   ```bash
   cd backend
   npm install
   
   # Créer .env
   echo "MONGODB_URI=mongodb://localhost:27017/bank-management" > .env
   echo "JWT_SECRET=votre-secret-key" >> .env
   
   # Démarrer
   npm start
   ```

3. **Frontend**
   ```bash
   cd frontend
   npm install
   
   # Créer .env
   echo "VITE_API_URL=http://localhost:3000" > .env
   
   # Démarrer
   npm run dev
   ```

4. **Tester**
   - Frontend : http://localhost:3001
   - Backend : http://localhost:3000/health
   - Login : `demo@bank.com` / `demo123`

## 📱 Installation sur iPhone

Voir le guide **[INSTALLATION_IPHONE.md](INSTALLATION_IPHONE.md)** pour installer l'application comme PWA sur iPhone.

## ✨ Fonctionnalités

- ✅ Authentification sécurisée (JWT)
- ✅ Gestion des clients (CRUD complet)
- ✅ Opérations bancaires
  - Dépôts
  - Retraits
  - Virements instantanés (max 20k CHF)
  - Virements standard (2-3 jours)
- ✅ Historique complet des opérations
- ✅ Recherche et filtres
- ✅ Interface responsive (mobile-first)
- ✅ PWA (installable sur iPhone/Android)
- ✅ Mode hors ligne (Service Worker)
- ✅ Compte démo préconfiguré

## 🏗️ Architecture

```
frontend/
├── src/
│   ├── components/      # Composants réutilisables
│   ├── pages/          # Pages de l'application
│   ├── contexts/       # Context API (Auth)
│   └── services/       # API calls (axios)
└── public/             # Assets statiques

backend/
├── models/             # Modèles MongoDB
├── routes/             # Routes Express
├── middleware/         # Auth middleware
└── server.js          # Point d'entrée
```

## 🔐 Sécurité

- ✅ Authentification JWT
- ✅ Mots de passe hashés (bcrypt)
- ✅ Validation des données
- ✅ CORS configuré
- ✅ Protection contre les injections
- ✅ HTTPS en production (Vercel)

## 🧪 Tests

### Test du backend
```bash
cd backend
npm start

# Dans un autre terminal
curl http://localhost:3000/health
```

### Test du login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@bank.com","password":"demo123"}'
```

## 🆘 Besoin d'aide ?

1. **Problèmes de déploiement** → Voir [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. **Configuration** → Voir [QUICK_START_DEPLOYMENT.md](QUICK_START_DEPLOYMENT.md)
3. **MongoDB** → Voir [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md)

## 📊 Technologies utilisées

### Frontend
- ⚛️ React 18
- ⚡ Vite 5
- 🎨 CSS3 (responsive)
- 📡 Axios
- 🔄 React Router v6
- 💾 LocalStorage (auth)

### Backend
- 🟢 Node.js + Express
- 🍃 MongoDB + Mongoose
- 🔐 JWT + bcrypt
- 🌐 CORS

### Déploiement
- ▲ Vercel (Frontend + Backend)
- 🍃 MongoDB Atlas (Database)
- 🔒 HTTPS automatique

## 📝 Identifiants de démo

- **Email** : `demo@bank.com`
- **Mot de passe** : `demo123`

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

ISC

---

*Dernière mise à jour : Décembre 2024 - Version cloud complète sur Vercel*

**🎉 Déployez votre application en 15 minutes avec [QUICK_START_DEPLOYMENT.md](QUICK_START_DEPLOYMENT.md) !**

