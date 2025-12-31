# 📱 Installer l'Application UBS sur iPhone

## 🎯 Installation PWA (Progressive Web App)

Votre application UBS peut être installée sur votre iPhone comme une application native, directement depuis Safari !

---

## ✅ Étapes Simples (5 minutes)

### 1️⃣ Ouvrir Safari sur iPhone

⚠️ **IMPORTANT : Utilisez uniquement Safari** (pas Chrome, Firefox ou autre)

- Ouvrez l'application **Safari** (l'icône boussole bleue)
- C'est le navigateur par défaut d'Apple

---

### 2️⃣ Aller sur l'URL de l'application

Dans la barre d'adresse de Safari, tapez :

```
https://ubs-nu.vercel.app
```

- Appuyez sur **"Aller"** ou Entrée
- Attendez que la page se charge complètement
- Vous devriez voir la page de connexion avec le logo UBS

💡 **Astuce** : Vous pouvez vous connecter d'abord pour tester :
- Email : `demo@bank.com`
- Mot de passe : `demo123`

---

### 3️⃣ Appuyer sur le bouton Partager

**En bas de l'écran Safari**, cherchez l'icône **Partager** :

- C'est un **carré avec une flèche vers le haut** ⬆️
- L'icône est au centre ou à droite de la barre d'outils
- Appuyez dessus

Un menu s'ouvre depuis le bas de l'écran.

---

### 4️⃣ Sélectionner "Sur l'écran d'accueil"

Dans le menu qui s'est ouvert :

1. **Faites défiler vers le bas** dans le menu
2. **Cherchez l'option** :
   - 🇫🇷 **"Sur l'écran d'accueil"** ou **"Ajouter à l'écran d'accueil"**
   - 🇬🇧 **"Add to Home Screen"**
3. **Appuyez sur cette option**

L'icône ressemble à un carré avec un "+" ou une icône de maison 🏠

---

### 5️⃣ Personnaliser le nom (optionnel)

Une nouvelle fenêtre s'ouvre avec :

- **L'icône UBS** en prévisualisation
- **Un champ de texte** avec le nom "UBS Bank"
- Vous pouvez **modifier le nom** si vous voulez (ex: "UBS", "Ma Banque", etc.)

💡 **Conseil** : Gardez un nom court (10-12 caractères maximum)

---

### 6️⃣ Confirmer l'ajout

1. Vérifiez le nom dans le champ de texte
2. **Appuyez sur "Ajouter"** en haut à droite (bouton bleu)
3. Une animation montre l'icône qui "vole" vers l'écran d'accueil

---

### 7️⃣ Trouver l'application sur l'écran d'accueil

**L'application est maintenant installée !** 🎉

- Cherchez l'**icône UBS** sur votre écran d'accueil
- Elle apparaît généralement sur la première page disponible
- Vous pouvez la **déplacer** où vous voulez (appui long + glisser)

---

## 🚀 Utiliser l'Application

### Lancement

- **Appuyez sur l'icône UBS** comme n'importe quelle autre app
- L'app s'ouvre **en plein écran** (sans barre Safari)
- Pas de barre d'adresse visible
- Se comporte exactement comme une app native

### Connexion

Utilisez le compte démo pour tester :

- **Email** : `demo@bank.com`
- **Mot de passe** : `demo123`

### Fonctionnalités

- ✅ Navigation fluide
- ✅ Gestion des clients/bénéficiaires
- ✅ Opérations bancaires
- ✅ Historique des transactions
- ✅ Fonctionne hors ligne (pages en cache)
- ✅ Mise à jour automatique

---

## ✨ Avantages de la PWA

### 🎯 Comme une App Native

- **Plein écran** : Pas de barre Safari
- **Icône sur l'écran d'accueil** : Comme les autres apps
- **Performance optimale** : Chargement rapide
- **Hors ligne** : Les pages visitées restent accessibles

### 💰 Gratuit et Instantané

- **Pas d'App Store** : Installation directe
- **Pas de frais** : Complètement gratuit
- **Mise à jour automatique** : Toujours la dernière version
- **Pas de compte développeur** : Aucune configuration complexe

---

## 🔍 Vérifications

### Testez que tout fonctionne :

1. ✅ **Lancement** : L'app s'ouvre en plein écran
2. ✅ **Connexion** : Vous pouvez vous connecter
3. ✅ **Navigation** : Toutes les pages fonctionnent
4. ✅ **Données** : Les informations se chargent correctement

---

## 🐛 Problèmes Courants

### ❌ L'option "Sur l'écran d'accueil" n'apparaît pas

**Solutions** :
- ✅ Vérifiez que vous utilisez **Safari** (pas un autre navigateur)
- ✅ Vérifiez que l'URL commence par **https://**
- ✅ Rafraîchissez la page (tirez vers le bas)
- ✅ Essayez de fermer et rouvrir Safari

### ❌ L'app ne se charge pas

**Solutions** :
- ✅ Vérifiez votre **connexion Internet**
- ✅ Vérifiez que l'URL est correcte : `https://ubs-nu.vercel.app`
- ✅ Essayez d'ouvrir l'URL dans Safari d'abord

### ❌ Erreur de connexion au backend

**Solutions** :
- ✅ Attendez quelques secondes (le backend peut être en veille)
- ✅ Rafraîchissez la page
- ✅ Vérifiez que vous avez bien Internet

---

## 💡 Astuces

### Organiser l'Icône

- **Appui long** sur l'icône pour entrer en mode édition
- **Glissez** l'icône où vous voulez (première page, dock, dossier)
- **Appuyez sur "Terminé"** quand vous avez fini

### Partager avec d'Autres

Pour partager l'app avec quelqu'un :

1. **Envoyez simplement l'URL** :
   ```
   https://ubs-nu.vercel.app
   ```

2. **Dites-lui de suivre ces étapes** :
   - Ouvrir Safari
   - Aller sur l'URL
   - Appuyer sur Partager > Sur l'écran d'accueil
   - Ajouter

### Compte de Démonstration

Pour tester ou partager :
- **Email** : `demo@bank.com`
- **Mot de passe** : `demo123`

---

## 📊 Informations Techniques

### Configuration PWA

Votre application est configurée comme PWA avec :

- ✅ **Manifest.json** : `/manifest.json`
- ✅ **Service Worker** : `/service-worker.js`
- ✅ **HTTPS** : Activé automatiquement par Vercel
- ✅ **Icônes** : Logo UBS optimisé

### URLs

- **Frontend** : https://ubs-nu.vercel.app
- **Backend** : https://ubsbackend.vercel.app
- **Base de données** : MongoDB Atlas

---

## 🎉 C'est Tout !

Votre application UBS est maintenant installée sur votre iPhone et fonctionne comme une application native !

**Profitez de votre banque digitale ! 💳**

---

## 📞 Besoin d'Aide ?

Si vous rencontrez des problèmes :

1. Vérifiez que Safari est à jour (Réglages > Général > Mise à jour logicielle)
2. Vérifiez votre connexion Internet
3. Essayez de redémarrer Safari
4. Essayez de redémarrer votre iPhone

---

**Version de l'application** : 1.0.0  
**Dernière mise à jour** : 31 décembre 2025  
**Compatible avec** : iOS 11.3 et supérieur

