# 📱 Installation sur iPhone - Guide Complet

Ce guide vous explique comment installer votre application UBS sur un iPhone de 3 façons différentes.

---

## 🎯 Option 1 : PWA (Progressive Web App) - RECOMMANDÉ

Cette méthode permet d'installer l'app comme une application native sur iPhone, sans passer par l'App Store. Une PWA (Progressive Web App) est une application web qui se comporte comme une application native, avec une icône sur l'écran d'accueil, un lancement en plein écran, et la possibilité de fonctionner hors ligne.

### 📋 Prérequis détaillés

#### 1. Application déployée
- ✅ **Backend déployé** sur Render (ou autre hébergeur) et accessible via HTTPS
- ✅ **Frontend déployé** sur Vercel (ou autre hébergeur) et accessible via HTTPS
- ✅ **Variables d'environnement** correctement configurées (`VITE_API_URL` dans Vercel)
- ✅ **CORS configuré** dans le backend pour autoriser votre domaine Vercel

#### 2. iPhone compatible
- ✅ **iOS 11.3 ou plus récent** (vérifiez dans Réglages > Général > À propos > Version)
- ✅ **Safari installé** (pré-installé sur tous les iPhone)
- ✅ **Connexion Internet** active (Wi-Fi ou données mobiles)

#### 3. Vérifications techniques
- ✅ Le site doit être en **HTTPS** (Vercel le fait automatiquement)
- ✅ Le fichier `manifest.json` doit être accessible
- ✅ Le `service-worker.js` doit être enregistré (vérifiez dans la console du navigateur)

### 📱 Étapes d'installation détaillées (avec descriptions visuelles)

#### Étape 1 : Ouvrir Safari sur iPhone

**⚠️ IMPORTANT : Safari uniquement !**

- ❌ **Ne pas utiliser** Chrome, Firefox, Edge ou autres navigateurs
- ✅ **Utiliser uniquement Safari** (l'icône boussole bleue)
- 📍 **Localisation** : Trouvez Safari sur votre écran d'accueil ou dans le dock en bas

**Pourquoi Safari uniquement ?**
- iOS ne permet l'installation de PWA que depuis Safari
- Les autres navigateurs sur iOS utilisent le moteur Safari mais n'ont pas accès à cette fonctionnalité
- C'est une limitation d'Apple, pas de votre application

---

#### Étape 2 : Accéder à l'URL de l'application

1. **Tapez ou collez l'URL** dans la barre d'adresse de Safari :
   ```
   https://votre-app.vercel.app
   ```
   *(Remplacez par votre vraie URL Vercel)*

2. **Appuyez sur "Aller"** ou la touche Entrée du clavier

3. **Attendez le chargement complet** de la page
   - Vous devriez voir la page de connexion de l'application UBS
   - La barre d'adresse en haut affiche l'URL complète
   - Un indicateur de chargement peut apparaître brièvement

**💡 Astuce :** Si c'est la première visite, le chargement peut prendre 30-50 secondes si votre backend Render est en mode "sleep" (plan gratuit). C'est normal !

**🔍 Vérification :** 
- Si vous voyez la page de connexion avec les champs Email et Mot de passe → ✅ Tout fonctionne
- Si vous voyez une erreur → Vérifiez votre connexion Internet et l'URL

---

#### Étape 3 : Accéder au menu Partager

**Localisation du bouton Partager :**

1. **Regardez en bas de l'écran Safari**
   - Vous verrez une barre d'outils avec plusieurs icônes
   - Cherchez l'icône **carrée avec une flèche pointant vers le haut** ⬆️
   - Cette icône est généralement au centre ou à droite de la barre

2. **Appuyez sur cette icône**
   - Un menu s'ouvre depuis le bas de l'écran
   - Ce menu contient plusieurs options de partage

**📱 Sur différentes versions d'iOS :**

- **iOS 12 et antérieur :** L'icône est un carré avec une flèche vers le haut
- **iOS 13-15 :** L'icône est un carré avec une flèche vers le haut, parfois avec le texte "Partager"
- **iOS 16+ :** L'icône peut être un carré avec une flèche ou simplement le texte "Partager"

**💡 Si vous ne trouvez pas le bouton :**
- Faites défiler la page vers le haut pour révéler la barre d'outils
- Essayez de faire défiler vers le bas puis vers le haut
- La barre peut être masquée automatiquement lors du défilement

---

#### Étape 4 : Trouver l'option "Sur l'écran d'accueil"

**Dans le menu Partager qui s'est ouvert :**

1. **Faites défiler vers le bas** dans le menu
   - Le menu contient plusieurs options : Message, Mail, Twitter, Facebook, etc.
   - Continuez à faire défiler jusqu'à voir une section avec des icônes d'applications

2. **Cherchez l'option "Sur l'écran d'accueil"**
   - **En français :** "Sur l'écran d'accueil" ou "Ajouter à l'écran d'accueil"
   - **En anglais :** "Add to Home Screen"
   - **Icône associée :** Un carré avec un "+" à l'intérieur, ou une icône de maison

3. **Appuyez sur cette option**

**📱 Apparence selon la version iOS :**

- **iOS 12-14 :** L'option apparaît dans une rangée d'icônes avec d'autres actions
- **iOS 15+ :** L'option peut être dans une section séparée en bas du menu, parfois avec une icône de maison

**⚠️ Si l'option n'apparaît pas :**
- Vérifiez que vous utilisez bien **Safari** (pas un autre navigateur)
- Vérifiez que le site est en **HTTPS** (commence par `https://`)
- Vérifiez que le fichier `manifest.json` est accessible (essayez `https://votre-app.vercel.app/manifest.json` dans Safari)
- Essayez de rafraîchir la page (tirez vers le bas pour actualiser)

---

#### Étape 5 : Personnaliser le nom de l'application

**Une nouvelle fenêtre s'ouvre avec :**

1. **Une icône prévisualisée** en haut
   - C'est l'icône qui apparaîtra sur l'écran d'accueil
   - Par défaut, c'est l'icône UBS depuis le fichier `manifest.json`

2. **Un champ de texte éditable** avec le nom
   - **Nom par défaut :** "UBS Bank" (défini dans `manifest.json`)
   - **Vous pouvez modifier ce nom** en tapant dessus
   - **Suggestions de noms :**
     - "UBS Bank"
     - "UBS Gestion"
     - "Gestion Bancaire"
     - Ou tout autre nom de votre choix (max 12 caractères recommandés pour éviter le troncature)

3. **Un bouton "Annuler"** en bas à gauche
4. **Un bouton "Ajouter"** en haut à droite

**💡 Conseils pour le nom :**
- Gardez-le court (10-12 caractères) pour éviter qu'il soit tronqué sous l'icône
- Utilisez des majuscules pour la première lettre de chaque mot
- Évitez les caractères spéciaux qui pourraient causer des problèmes

---

#### Étape 6 : Confirmer l'ajout

1. **Vérifiez le nom** dans le champ de texte (modifiez si nécessaire)

2. **Appuyez sur "Ajouter"** en haut à droite de l'écran
   - Le bouton est généralement en bleu
   - Il peut être désactivé (gris) si le nom est vide

3. **Une animation de confirmation** apparaît
   - L'icône semble "voler" vers l'écran d'accueil
   - Un message de confirmation peut apparaître brièvement

---

#### Étape 7 : Localiser l'application sur l'écran d'accueil

**Après l'ajout :**

1. **Safari se ferme automatiquement** (ou vous retournez à l'écran d'accueil)

2. **Cherchez la nouvelle icône** sur votre écran d'accueil
   - **Emplacement :** Généralement sur la première page disponible, après vos autres applications
   - **Apparence :** Icône UBS avec le nom que vous avez choisi en dessous
   - **Style :** L'icône a les coins arrondis comme les autres apps iOS

3. **Organisez l'icône** (optionnel)
   - **Appuyez longuement** sur l'icône pour entrer en mode édition
   - **Glissez l'icône** où vous voulez (première page, dock, dossier, etc.)
   - **Appuyez sur "Terminé"** quand vous avez fini

**🎨 L'icône sur l'écran d'accueil :**
- A la même apparence que les autres applications iOS
- S'ouvre en plein écran (sans barre d'adresse Safari)
- Se comporte exactement comme une application native

---

### 🚀 Utilisation de l'application installée

**Une fois installée, l'application se comporte comme une app native :**

1. **Lancement :**
   - Appuyez sur l'icône comme n'importe quelle autre app
   - L'app s'ouvre en plein écran (sans interface Safari)
   - Pas de barre d'adresse visible

2. **Expérience utilisateur :**
   - Navigation fluide comme une app native
   - Animations et transitions iOS natives
   - Support des gestes iOS (swipe, pull-to-refresh, etc.)

3. **Fonctionnalités hors ligne :**
   - Les pages visitées sont mises en cache
   - Vous pouvez revoir les pages déjà visitées sans Internet
   - Les nouvelles données nécessitent une connexion Internet

4. **Mises à jour :**
   - L'app se met à jour automatiquement quand vous la lancez
   - Pas besoin de réinstaller manuellement
   - Les nouvelles versions sont téléchargées en arrière-plan

---

### ✅ Avantages détaillés de la PWA

#### 1. Fonctionne comme une app native
- **Interface native iOS** : Pas de barre d'adresse, plein écran
- **Performance optimisée** : Cache intelligent, chargement rapide
- **Intégration système** : Apparaît dans le gestionnaire d'applications iOS
- **Notifications** : Possibilité d'ajouter des notifications push (configuration avancée)

#### 2. Pas besoin de l'App Store
- **Installation instantanée** : Pas d'attente d'approbation Apple
- **Pas de frais** : Gratuit, pas de compte développeur nécessaire
- **Distribution facile** : Partagez simplement l'URL
- **Mises à jour immédiates** : Pas besoin d'attendre l'approbation

#### 3. Mise à jour automatique
- **Synchronisation automatique** : L'app se met à jour à chaque lancement
- **Pas de versioning** : Toujours la dernière version
- **Transparent pour l'utilisateur** : Pas besoin de mettre à jour manuellement

#### 4. Fonctionne hors ligne (basique)
- **Cache des pages** : Les pages visitées sont accessibles sans Internet
- **Service Worker** : Gère le cache automatiquement
- **Expérience dégradée** : Certaines fonctionnalités nécessitent Internet

#### 5. Gratuit et instantané
- **Aucun coût** : Gratuit pour vous et vos utilisateurs
- **Installation rapide** : Moins de 30 secondes
- **Pas de configuration complexe** : Fonctionne immédiatement

---

### 🔍 Vérifications post-installation

**Pour vérifier que tout fonctionne correctement :**

1. **Testez le lancement :**
   - Appuyez sur l'icône → L'app doit s'ouvrir en plein écran

2. **Testez la connexion :**
   - Connectez-vous avec `demo@bank.com` / `demo123`
   - Vérifiez que les données se chargent correctement

3. **Testez la navigation :**
   - Naviguez entre les différentes pages
   - Vérifiez que tout fonctionne fluide

4. **Testez hors ligne (optionnel) :**
   - Activez le mode avion
   - Relancez l'app → Les pages en cache devraient être accessibles

---

### 💡 Astuces et conseils

**Pour une meilleure expérience :**

- 📱 **Organisez l'icône** : Placez-la sur la première page ou dans le dock pour un accès rapide
- 🔄 **Rafraîchissez si nécessaire** : Si l'app semble obsolète, fermez-la complètement et relancez-la
- 📶 **Vérifiez la connexion** : Certaines fonctionnalités nécessitent Internet
- 🎨 **Personnalisez le nom** : Choisissez un nom court et mémorable
- 🔔 **Notifications** : Les notifications push nécessitent une configuration supplémentaire (non incluse dans cette version de base)

---

## 🌐 Option 2 : Accès Web Simple

La méthode la plus simple - ouvrir le site dans Safari.

### Étapes

1. Ouvrez **Safari** sur iPhone
2. Allez sur : `https://votre-app.vercel.app`
3. Ajoutez aux favoris si vous voulez y revenir facilement

### Avantages
- ✅ Aucune installation nécessaire
- ✅ Toujours à jour
- ✅ Fonctionne immédiatement

### Inconvénients
- ❌ Pas d'icône sur l'écran d'accueil
- ❌ Doit ouvrir Safari manuellement

---

## 📲 Option 3 : Application iOS Native (SwiftUI)

Si vous avez accès à un **Mac avec Xcode**, vous pouvez compiler et installer l'app native iOS.

### Prérequis
- ✅ Mac avec macOS
- ✅ Xcode installé (gratuit depuis l'App Store)
- ✅ Compte Apple Developer (gratuit pour tester sur votre propre iPhone)

### Étapes

1. **Ouvrez Xcode** sur votre Mac

2. **Créez un nouveau projet** :
   - File > New > Project
   - iOS > App
   - Nom : `BankManagement`
   - Interface : SwiftUI
   - Language : Swift

3. **Importez tous les fichiers** du dossier `ios/BankManagement/` dans votre projet Xcode

4. **Connectez votre iPhone** via USB

5. **Sélectionnez votre iPhone** comme destination dans Xcode

6. **Configurez votre compte Apple** :
   - Xcode > Settings > Accounts
   - Ajoutez votre Apple ID
   - Sélectionnez votre équipe dans le projet

7. **Modifiez l'URL de l'API** dans `APIService.swift` :
   ```swift
   private let baseURL = "https://votre-backend.onrender.com/api"
   ```

8. **Cliquez sur "Run"** (▶️) pour compiler et installer sur votre iPhone

### Avantages
- ✅ Performance native optimale
- ✅ Accès complet aux fonctionnalités iOS
- ✅ Expérience utilisateur parfaite

### Inconvénients
- ❌ Nécessite un Mac
- ❌ Plus complexe à configurer
- ❌ Nécessite un compte développeur pour distribuer

---

## 🔧 Configuration pour PWA

Si vous voulez améliorer l'expérience PWA, assurez-vous que :

1. **Votre site est en HTTPS** (Vercel le fait automatiquement)

2. **Le manifest.json est accessible** :
   ```
   https://votre-app.vercel.app/manifest.json
   ```

3. **Le service-worker.js est accessible** :
   ```
   https://votre-app.vercel.app/service-worker.js
   ```

4. **Les icônes sont présentes** dans `/public/images/`

---

## 🐛 Dépannage

### L'option "Sur l'écran d'accueil" n'apparaît pas
- ✅ Vérifiez que vous utilisez **Safari** (pas Chrome)
- ✅ Vérifiez que le site est en **HTTPS**
- ✅ Vérifiez que le `manifest.json` est accessible

### L'app ne se charge pas
- ✅ Vérifiez votre connexion Internet
- ✅ Vérifiez que le backend (Render) est actif
- ✅ Vérifiez les logs dans Vercel et Render

### L'app se charge mais ne peut pas se connecter au backend
- ✅ Vérifiez que `VITE_API_URL` est correctement configuré dans Vercel
- ✅ Vérifiez que CORS est configuré dans `backend/server.js` pour autoriser votre domaine Vercel

---

## 📤 Partage avec votre client

Pour partager l'app avec votre client :

1. **Envoyez-lui simplement l'URL** :
   ```
   https://votre-app.vercel.app
   ```

2. **Donnez-lui ces instructions** :
   - Ouvrez Safari sur iPhone
   - Allez sur l'URL
   - Appuyez sur "Partager" > "Sur l'écran d'accueil"
   - Ajoutez l'app

3. **Compte de démonstration** :
   - Email : `demo@bank.com`
   - Mot de passe : `demo123`

---

## ✅ Checklist de déploiement

Avant de partager avec le client, vérifiez :

- [ ] Backend déployé sur Render et fonctionnel
- [ ] Frontend déployé sur Vercel
- [ ] Variable `VITE_API_URL` configurée dans Vercel
- [ ] CORS configuré dans `backend/server.js` pour autoriser votre domaine Vercel
- [ ] Testez la connexion depuis un iPhone
- [ ] Testez l'installation PWA
- [ ] Vérifiez que le compte démo fonctionne

---

## 💳 Guide pour le Client : Acheter un Plan Vercel et Déployer le Projet

Cette section est destinée à votre **client** qui souhaite héberger et déployer le projet UBS sur son propre compte Vercel.

### 📋 Prérequis pour le Client

Avant de commencer, le client doit avoir :
- ✅ Un compte **GitHub** (gratuit) : https://github.com/signup
- ✅ Accès au **code source** du projet (repository GitHub)
- ✅ Un compte **email** pour créer le compte Vercel
- ✅ Une **carte bancaire** (si plan payant) ou utiliser le plan gratuit

---

### 🆓 Option 1 : Plan Gratuit Vercel (Recommandé pour commencer)

Le plan gratuit de Vercel est **suffisant** pour la plupart des projets de démonstration et petites applications.

#### Avantages du Plan Gratuit :
- ✅ **100 GB de bande passante** par mois
- ✅ **Déploiements illimités**
- ✅ **HTTPS automatique**
- ✅ **Domaines personnalisés** (1 domaine)
- ✅ **Support communautaire**
- ✅ **Pas de carte bancaire requise**

#### Limitations :
- ⚠️ **100 GB de bande passante/mois** (généralement suffisant pour des milliers de visiteurs)
- ⚠️ **Pas de support prioritaire**
- ⚠️ **Pas de fonctionnalités avancées** (analytics, logs étendus)

---

### 💰 Option 2 : Plans Payants Vercel

Si le client a besoin de plus de ressources ou de fonctionnalités avancées :

#### Plan Pro - $20/mois
- ✅ **1 TB de bande passante** par mois
- ✅ **Déploiements illimités**
- ✅ **Analytics avancés**
- ✅ **Support prioritaire**
- ✅ **Domaines personnalisés illimités**
- ✅ **Fonctionnalités de collaboration**

#### Plan Enterprise - Sur devis
- ✅ **Bande passante illimitée**
- ✅ **Support 24/7**
- ✅ **SLA garanti**
- ✅ **Fonctionnalités avancées de sécurité**
- ✅ **Gestion d'équipe complète**

---

### 📝 Étapes Détaillées : Créer un Compte et Déployer

#### Étape 1 : Créer un Compte Vercel

1. **Allez sur le site Vercel** :
   ```
   https://vercel.com/signup
   ```

2. **Choisissez votre méthode de connexion** :
   - **Option A : Via GitHub** (Recommandé)
     - Cliquez sur "Continue with GitHub"
     - Autorisez Vercel à accéder à votre compte GitHub
     - C'est la méthode la plus simple pour déployer depuis GitHub
   
   - **Option B : Via Email**
     - Entrez votre email
     - Créez un mot de passe
     - Confirmez votre email

3. **Complétez votre profil** :
   - Prénom et nom
   - Nom d'utilisateur Vercel
   - Acceptez les conditions d'utilisation

4. **✅ Compte créé !** Vous arrivez sur le tableau de bord Vercel

---

#### Étape 2 : Choisir un Plan (Gratuit ou Payant)

1. **Dans le tableau de bord Vercel**, cliquez sur votre **nom d'utilisateur** en haut à droite

2. **Sélectionnez "Settings"** (Paramètres)

3. **Cliquez sur "Billing"** (Facturation) dans le menu de gauche

4. **Choisissez votre plan** :

   **Pour le Plan Gratuit :**
   - Le plan gratuit est **automatiquement activé** lors de la création du compte
   - Aucune action nécessaire
   - Vous pouvez commencer à déployer immédiatement

   **Pour un Plan Payant :**
   - Cliquez sur "Upgrade to Pro" ou "Upgrade to Enterprise"
   - Sélectionnez le plan souhaité
   - **Ajoutez votre carte bancaire** :
     - Numéro de carte
     - Date d'expiration
     - CVV
     - Adresse de facturation
   - Confirmez l'achat
   - ⚠️ **Note** : Vercel facture mensuellement ou annuellement selon votre choix

5. **Confirmation** :
   - Vous recevrez un email de confirmation
   - Votre plan est immédiatement actif

---

#### Étape 3 : Importer le Projet depuis GitHub

1. **Retournez au tableau de bord Vercel**

2. **Cliquez sur "Add New..."** (Ajouter nouveau) ou le bouton **"New Project"** (Nouveau projet)

3. **Sélectionnez "Import Git Repository"** (Importer un dépôt Git)

4. **Autorisez Vercel à accéder à GitHub** (si pas déjà fait) :
   - Cliquez sur "Import" à côté de votre repository GitHub
   - Ou cliquez sur "Adjust GitHub App Permissions" pour autoriser l'accès

5. **Sélectionnez le repository** :
   - Cherchez le repository `ubs-v1` (ou le nom de votre projet)
   - Cliquez sur "Import" à côté du repository

---

#### Étape 4 : Configurer le Projet

Une fois le repository importé, vous devez configurer le projet :

1. **Choisissez l'emplacement et le nom** :
   - **Équipe Vercel** : Sélectionnez votre compte personnel ou une équipe
   - **Nom du Projet** : Laissez le nom par défaut ou modifiez-le (ex: `ubs-bank-app`)

2. **Configurez le Framework** :
   - **Framework Preset** : Sélectionnez **"Vite"** dans le menu déroulant
   - ⚠️ **Important** : Ne sélectionnez PAS "Next.js" car le projet utilise Vite

3. **Configurez le Root Directory** :
   - Cliquez sur "Modifier" à côté de "Répertoire racine"
   - Sélectionnez le dossier **"frontend"** dans la liste
   - ⚠️ **Important** : Le code frontend est dans le dossier `frontend/`, pas à la racine

4. **Ouvrez "Paramètres de compilation et de sortie"** (Build and Output Settings) :
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
   - **Install Command** : `npm install`
   - **Development Command** : `npm run dev`

5. **Configurez les Variables d'Environnement** :
   - Cliquez sur "Variables d'environnement" (Environment Variables)
   - Cliquez sur "Add" (Ajouter)
   - **Nom** : `VITE_API_URL`
   - **Valeur** : L'URL de votre backend (ex: `https://votre-backend.onrender.com`)
   - **Environnements** : Cochez **Production**, **Preview**, et **Development**
   - Cliquez sur "Save" (Enregistrer)

   ⚠️ **Important** : Remplacez `https://votre-backend.onrender.com` par l'URL réelle de votre backend déployé sur Render (ou autre hébergeur).

---

#### Étape 5 : Déployer le Projet

1. **Vérifiez toutes les configurations** :
   - ✅ Framework : Vite
   - ✅ Root Directory : frontend
   - ✅ Build Command : npm run build
   - ✅ Output Directory : dist
   - ✅ Variable VITE_API_URL configurée

2. **Cliquez sur le bouton "Déployer"** (Deploy) en bas de la page

3. **Attendez le déploiement** :
   - Vercel va cloner le repository
   - Installer les dépendances (`npm install`)
   - Builder le projet (`npm run build`)
   - Déployer les fichiers
   - ⏱️ **Temps estimé** : 2-5 minutes

4. **Suivez la progression** :
   - Vous verrez les logs de build en temps réel
   - Des messages indiquent chaque étape
   - En cas d'erreur, les logs indiqueront le problème

---

#### Étape 6 : Obtenir l'URL de l'Application

Une fois le déploiement terminé :

1. **Vous verrez une page de succès** avec :
   - ✅ Message "Congratulations! Your project has been deployed"
   - L'URL de votre application (ex: `https://ubs-bank-app.vercel.app`)

2. **Copiez l'URL** :
   - Cette URL est **permanente** et ne changera pas
   - Vous pouvez la partager avec vos utilisateurs
   - Elle fonctionne immédiatement

3. **Testez l'application** :
   - Cliquez sur l'URL ou ouvrez-la dans un navigateur
   - Vous devriez voir la page de connexion UBS
   - Testez la connexion avec `demo@bank.com` / `demo123`

---

### 🔧 Configuration Post-Déploiement

#### Vérifier que tout fonctionne

1. **Testez l'application** :
   - Ouvrez l'URL Vercel dans un navigateur
   - Connectez-vous avec le compte démo
   - Vérifiez que les données se chargent

2. **Vérifiez les fichiers PWA** :
   - Testez : `https://votre-app.vercel.app/manifest.json`
   - Testez : `https://votre-app.vercel.app/service-worker.js`
   - Ces fichiers doivent être accessibles

3. **Vérifiez la connexion au backend** :
   - Si vous voyez des erreurs de connexion, vérifiez :
     - Que `VITE_API_URL` est correctement configuré
     - Que le backend est actif et accessible
     - Que CORS est configuré dans le backend pour autoriser votre domaine Vercel

---

### 📊 Gérer le Projet après Déploiement

#### Accéder au Tableau de Bord

1. **Allez sur** : https://vercel.com/dashboard
2. **Cliquez sur votre projet** pour voir :
   - Les déploiements
   - Les logs
   - Les statistiques
   - Les paramètres

#### Mettre à Jour le Projet

**Méthode automatique (recommandée) :**
- Chaque fois que vous poussez du code sur GitHub, Vercel **redéploie automatiquement**
- Pas d'action nécessaire de votre part

**Méthode manuelle :**
1. Allez dans votre projet sur Vercel
2. Cliquez sur "Deployments" (Déploiements)
3. Cliquez sur les trois points (⋯) à côté d'un déploiement
4. Sélectionnez "Redeploy" (Redéployer)

#### Voir les Logs

1. Allez dans votre projet
2. Cliquez sur "Deployments"
3. Cliquez sur un déploiement spécifique
4. Cliquez sur "View Build Logs" pour voir les logs de build
5. Cliquez sur "Runtime Logs" pour voir les logs en production

#### Modifier les Variables d'Environnement

1. Allez dans votre projet
2. Cliquez sur "Settings" (Paramètres)
3. Cliquez sur "Environment Variables" (Variables d'environnement)
4. Modifiez ou ajoutez des variables
5. ⚠️ **Important** : Après modification, vous devez **redéployer** le projet

---

### 💳 Gérer la Facturation

#### Voir l'Utilisation

1. Allez dans **Settings** > **Billing**
2. Vous verrez :
   - Votre plan actuel
   - L'utilisation de la bande passante
   - Les coûts (si plan payant)
   - L'historique des factures

#### Changer de Plan

1. Allez dans **Settings** > **Billing**
2. Cliquez sur "Change Plan" (Changer de plan)
3. Sélectionnez le nouveau plan
4. Confirmez le changement

#### Annuler un Plan Payant

1. Allez dans **Settings** > **Billing**
2. Cliquez sur "Cancel Subscription" (Annuler l'abonnement)
3. Confirmez l'annulation
4. ⚠️ **Note** : Vous retournerez au plan gratuit à la fin de la période facturée

---

### 🆘 Support et Aide

#### Support Vercel

- **Documentation** : https://vercel.com/docs
- **Support Communautaire** : https://github.com/vercel/vercel/discussions
- **Support Email** : support@vercel.com (pour les plans payants)

#### Problèmes Courants

**Le déploiement échoue :**
- Vérifiez les logs de build dans Vercel
- Vérifiez que le Root Directory est correct (`frontend`)
- Vérifiez que le Framework est bien "Vite"

**L'application ne se charge pas :**
- Vérifiez que `VITE_API_URL` est configuré
- Vérifiez que le backend est accessible
- Vérifiez les logs Runtime dans Vercel

**Erreur de connexion au backend :**
- Vérifiez que l'URL du backend est correcte dans `VITE_API_URL`
- Vérifiez que CORS est configuré dans le backend
- Vérifiez que le backend est actif

---

### 📋 Checklist Complète pour le Client

Avant de considérer le projet comme déployé et prêt :

- [ ] Compte Vercel créé
- [ ] Plan choisi (gratuit ou payant)
- [ ] Projet importé depuis GitHub
- [ ] Framework configuré sur "Vite"
- [ ] Root Directory configuré sur "frontend"
- [ ] Variables d'environnement configurées (`VITE_API_URL`)
- [ ] Déploiement réussi
- [ ] URL obtenue et testée
- [ ] Application fonctionnelle (connexion, navigation)
- [ ] Fichiers PWA accessibles (`manifest.json`, `service-worker.js`)
- [ ] Test sur iPhone réussi (installation PWA)

---

### 💰 Coûts Estimés

#### Plan Gratuit
- **Coût mensuel** : $0
- **Bande passante** : 100 GB/mois
- **Idéal pour** : Démonstrations, petits projets, tests

#### Plan Pro
- **Coût mensuel** : $20
- **Bande passante** : 1 TB/mois
- **Idéal pour** : Applications en production, trafic moyen

#### Plan Enterprise
- **Coût mensuel** : Sur devis (généralement $500+/mois)
- **Bande passante** : Illimitée
- **Idéal pour** : Grandes entreprises, applications critiques

**💡 Recommandation** : Commencez avec le **plan gratuit** et passez au plan payant uniquement si nécessaire.

---

**🎉 Une fois ces étapes complétées, votre client aura son propre déploiement Vercel et pourra gérer le projet indépendamment !**

---

**🎉 Votre application est maintenant prête à être installée sur iPhone !**

