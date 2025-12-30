# 🍃 Configuration MongoDB Atlas (Gratuit)

MongoDB Atlas offre une base de données MongoDB gratuite dans le cloud, parfaite pour votre application.

## 🚀 Configuration rapide (5 minutes)

### 1. Créer un compte

1. Allez sur https://www.mongodb.com/cloud/atlas/register
2. Créez un compte (utilisez votre email ou connectez-vous avec Google)

### 2. Créer un cluster gratuit

1. Une fois connecté, cliquez sur **"Build a Database"**

2. Sélectionnez **"M0 FREE"** :
   - Provider : **AWS** (recommandé)
   - Region : Choisissez la plus proche (ex: **Paris** pour l'Europe)
   - Cluster Name : `ubs-cluster` (ou laissez par défaut)

3. Cliquez sur **"Create"**

### 3. Configurer la sécurité

#### A. Créer un utilisateur de base de données

1. Une popup "Security Quickstart" apparaît
2. Choisissez **"Username and Password"**
3. Créez un utilisateur :
   - Username : `ubsadmin`
   - Password : Cliquez sur "Autogenerate Secure Password" et **copiez-le** !
   - ⚠️ **Sauvegardez ce mot de passe**, vous en aurez besoin !

4. Cliquez sur **"Create User"**

#### B. Autoriser l'accès depuis n'importe où

1. Dans la même popup, section "Where would you like to connect from?"
2. Sélectionnez **"My Local Environment"**
3. Cliquez sur **"Add My Current IP Address"**
4. **Important** : Ajoutez aussi **0.0.0.0/0** pour autoriser Vercel :
   - Cliquez sur **"Add a Different IP Address"**
   - IP Address : `0.0.0.0/0`
   - Description : `Allow Vercel`
   - Cliquez sur **"Add Entry"**

5. Cliquez sur **"Finish and Close"**

### 4. Obtenir l'URI de connexion

1. Sur la page principale, cliquez sur **"Connect"** (à côté de votre cluster)

2. Sélectionnez **"Connect your application"**

3. Driver : **Node.js**, Version : **4.1 or later**

4. Copiez la **Connection String** :
   ```
   mongodb+srv://ubsadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

5. **Modifiez l'URI** :
   - Remplacez `<password>` par votre mot de passe (celui que vous avez copié)
   - Ajoutez le nom de la base de données : `/bank-management` après `.net`
   
   Résultat final :
   ```
   mongodb+srv://ubsadmin:VotreMOTdePASSE@cluster0.xxxxx.mongodb.net/bank-management?retryWrites=true&w=majority
   ```

### 5. Tester la connexion (optionnel)

#### Depuis votre machine locale :

1. Ouvrez `backend/.env`
2. Ajoutez/Modifiez :
   ```env
   MONGODB_URI=mongodb+srv://ubsadmin:VotreMOTdePASSE@cluster0.xxxxx.mongodb.net/bank-management?retryWrites=true&w=majority
   ```

3. Testez :
   ```bash
   cd backend
   npm start
   ```

4. Vous devriez voir :
   ```
   MongoDB Connected
   ✅ Compte démo créé avec succès!
   ```

### 6. Utiliser dans Vercel

1. **Sur Vercel** (Dashboard → Votre projet backend → Settings → Environment Variables)

2. Ajoutez/Modifiez la variable **MONGODB_URI** :
   ```
   mongodb+srv://ubsadmin:VotreMOTdePASSE@cluster0.xxxxx.mongodb.net/bank-management?retryWrites=true&w=majority
   ```

3. Redéployez le backend

## 📊 Gestion de la base de données

### Voir vos données

1. Sur MongoDB Atlas, cliquez sur **"Browse Collections"**
2. Vous verrez votre base `bank-management` avec les collections :
   - `users`
   - `clients`
   - `operations`

### Créer des sauvegardes

Atlas fait des sauvegardes automatiques, même dans le plan gratuit !

### Monitorer l'utilisation

1. Atlas Dashboard → Votre cluster
2. Onglet **"Metrics"** pour voir :
   - Connexions actives
   - Opérations par seconde
   - Stockage utilisé

### Limites du plan gratuit (M0)

- ✅ **512 MB** de stockage (largement suffisant pour commencer)
- ✅ **100 connexions simultanées max**
- ✅ **Backups automatiques**
- ✅ Pas de limite de requêtes

## 🔒 Sécurité

### Bonnes pratiques

1. **Ne partagez JAMAIS** votre URI de connexion publiquement
2. Utilisez des variables d'environnement (`.env`, Vercel Environment Variables)
3. Changez le mot de passe régulièrement
4. En production, limitez les IPs autorisées (pas besoin de `0.0.0.0/0`)

### Gérer les accès

1. Atlas Dashboard → Database Access
2. Vous pouvez :
   - Ajouter/supprimer des utilisateurs
   - Changer les mots de passe
   - Définir des permissions

### Gérer les IPs autorisées

1. Atlas Dashboard → Network Access
2. Vous pouvez :
   - Ajouter/supprimer des IPs
   - Configurer des périodes d'accès temporaires

## 🆘 Dépannage

### Erreur : "Authentication failed"
- Vérifiez que le mot de passe dans l'URI est correct
- Pas d'espaces ou caractères spéciaux non encodés
- Si le mot de passe contient des caractères spéciaux, encodez-les (ex: `@` → `%40`)

### Erreur : "Connection timeout"
- Vérifiez que `0.0.0.0/0` est ajouté dans Network Access
- Attendez 2-3 minutes après avoir ajouté l'IP

### Erreur : "Database not found"
- Assurez-vous que le nom de la base `bank-management` est dans l'URI
- Format : `...mongodb.net/bank-management?retryWrites=...`

### Cluster en pause
- Les clusters gratuits se mettent en pause après 60 jours d'inactivité
- Il suffit de cliquer sur "Resume" pour les réactiver

## 💰 Coûts

- **M0 (Free)** : **0€/mois** - Parfait pour débuter et petits projets
- **M10** : ~9€/mois - Si vous dépassez 512 MB
- **M20** : ~40€/mois - Pour des applications en production

Pour votre projet, **M0 est largement suffisant** ! 🎉

## 📚 Ressources

- Documentation : https://docs.atlas.mongodb.com/
- Tutoriels : https://learn.mongodb.com/
- Support : https://support.mongodb.com/

## ✅ Checklist finale

Avant de déployer sur Vercel, vérifiez :

- [ ] Cluster créé sur MongoDB Atlas
- [ ] Utilisateur de base de données créé
- [ ] IP `0.0.0.0/0` ajoutée dans Network Access
- [ ] URI de connexion obtenue et modifiée avec le mot de passe
- [ ] Base de données testée localement (optionnel)
- [ ] URI ajoutée dans les variables d'environnement Vercel

Une fois ces étapes complétées, vous êtes prêt pour déployer le backend ! 🚀

