# 🎯 Commandes Essentielles - ConfigurateurPC API

## 🚀 Démarrage Rapide (3 minutes)

```bash
# 1. Installer les dépendances (si pas déjà fait)
npm install

# 2. Copier le fichier d'environnement (si pas déjà fait)
cp .env.example .env

# 3. Démarrer MongoDB (si pas déjà démarré)
# Sur macOS avec Homebrew :
brew services start mongodb-community
# Ou manuellement :
mongod

# 4. Peupler la base de données avec des données de test
npm run seed

# 5. Lancer l'application
npm run dev
```

✨ **C'est tout !** Votre API est maintenant accessible sur http://localhost:3000

---

## 📝 Comptes de Test

Après avoir exécuté `npm run seed`, vous pouvez utiliser :

### Compte Administrateur
- **Email** : admin@configurateurpc.com
- **Password** : admin123
- **Rôle** : admin (accès complet)

### Compte Utilisateur
- **Email** : user@example.com
- **Password** : user123
- **Rôle** : user (accès limité)

---

## 🔧 Commandes Principales

### Développement
```bash
npm run dev          # Lancer avec nodemon (auto-reload)
npm start           # Lancer en mode production
```

### Base de données
```bash
npm run seed        # Peupler la base avec des données de test
```

### Tests
```bash
npm test                # Lancer tous les tests
npm run test:watch      # Tests en mode watch
npm run test:coverage   # Tests avec rapport de couverture
```

---

## 🌐 URLs Importantes

| Service | URL |
|---------|-----|
| API Homepage | http://localhost:3000 |
| Documentation Swagger | http://localhost:3000/api-docs |
| MongoDB (local) | mongodb://localhost:27017 |

---

## 🔍 Tester l'API Rapidement

### 1. Obtenir un Token
```bash
# Se connecter avec le compte admin
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@configurateurpc.com","password":"admin123"}'
```

Copiez le `token` dans la réponse !

### 2. Tester une Route Protégée
```bash
# Remplacez VOTRE_TOKEN par le token reçu
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

### 3. Créer une Catégorie
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -d '{"name":"Test Category","description":"Test description"}'
```

---

## 🐛 Dépannage Rapide

### Problème : "MongoDB connection error"
```bash
# Solution 1 : Démarrer MongoDB
mongod
# ou
brew services start mongodb-community

# Solution 2 : Vérifier l'URL dans .env
# Ouvrir .env et vérifier :
# MONGODB_URI=mongodb://localhost:27017/configurateur-pc
```

### Problème : "Port 3000 already in use"
```bash
# Solution 1 : Tuer le processus sur le port 3000
lsof -ti:3000 | xargs kill -9

# Solution 2 : Changer le port dans .env
# PORT=3001
```

### Problème : "JWT_SECRET is not defined"
```bash
# Vérifier que le fichier .env existe
ls -la .env

# S'il n'existe pas :
cp .env.example .env
```

### Problème : "Cannot find module"
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Endpoints Essentiels à Connaître

### Public (pas de token requis)
```bash
# Liste des catégories
GET http://localhost:3000/api/categories

# Liste des composants
GET http://localhost:3000/api/components

# Détails d'un composant
GET http://localhost:3000/api/components/:id
```

### Authentifié (token requis)
```bash
# Mon profil
GET http://localhost:3000/api/auth/me

# Mes configurations
GET http://localhost:3000/api/configurations

# Créer une configuration
POST http://localhost:3000/api/configurations

# Exporter en PDF
GET http://localhost:3000/api/configurations/:id/export-pdf
```

### Admin uniquement
```bash
# Liste des utilisateurs
GET http://localhost:3000/api/users

# Créer un composant
POST http://localhost:3000/api/components

# Créer un partenaire
POST http://localhost:3000/api/partners
```

---

## 📱 Utiliser Postman

### 1. Importer la Collection
- Ouvrir Postman
- Aller sur http://localhost:3000/api-docs
- Cliquer sur "Explore" > "Download OpenAPI specification"
- Importer le fichier dans Postman

### 2. Configurer l'Authentification
- Dans Postman, créer une variable d'environnement `token`
- Après la connexion, copier le token dans cette variable
- Utiliser `{{token}}` dans les headers Authorization

---

## 🗄️ Accéder à la Base de Données

### MongoDB Compass (GUI)
1. Télécharger MongoDB Compass
2. Se connecter avec : `mongodb://localhost:27017`
3. Ouvrir la base `configurateur-pc`

### Ligne de commande
```bash
# Se connecter à MongoDB
mongosh

# Utiliser la base de données
use configurateur-pc

# Voir les collections
show collections

# Voir les utilisateurs
db.users.find().pretty()

# Compter les composants
db.components.countDocuments()
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [README.md](README.md) | Documentation complète |
| [QUICK_START.md](QUICK_START.md) | Guide de démarrage rapide |
| [BACKOFFICE.md](BACKOFFICE.md) | Spécifications Back-Office |
| [PROJET_SYNTHESE.md](PROJET_SYNTHESE.md) | Synthèse du projet |
| [GIT_GUIDE.md](GIT_GUIDE.md) | Guide Git et publication |
| http://localhost:3000/api-docs | Documentation interactive Swagger |

---

## ⚡ Workflow de Développement Typique

### Nouveau jour de travail
```bash
# 1. Démarrer MongoDB
brew services start mongodb-community

# 2. Lancer l'API en mode dev
npm run dev

# 3. Ouvrir la documentation
open http://localhost:3000/api-docs
```

### Ajouter une nouvelle fonctionnalité
```bash
# 1. Créer une branche
git checkout -b feature/ma-nouvelle-fonctionnalite

# 2. Développer et tester
npm run dev
npm test

# 3. Commiter
git add .
git commit -m "feat: description de la fonctionnalité"

# 4. Fusionner
git checkout main
git merge feature/ma-nouvelle-fonctionnalite
```

### Avant de partir
```bash
# 1. Commiter les changements
git add .
git commit -m "chore: end of day commit"

# 2. Pousser sur GitHub
git push origin main

# 3. Arrêter MongoDB (optionnel)
brew services stop mongodb-community
```

---

## 🔑 Variables d'Environnement Importantes

```env
# Requis
MONGODB_URI=mongodb://localhost:27017/configurateur-pc
JWT_SECRET=changez_ce_secret_en_production

# Optionnels
PORT=3000
NODE_ENV=development
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:3001
```

---

## 🎨 Prochaines Étapes

### Pour tester l'API
1. ✅ Lancer `npm run seed`
2. ✅ Ouvrir http://localhost:3000/api-docs
3. ✅ Se connecter et obtenir un token
4. ✅ Tester les différents endpoints

### Pour développer le Back-Office
1. ✅ Lire [BACKOFFICE.md](BACKOFFICE.md)
2. ✅ Choisir React ou Angular
3. ✅ Créer le projet front-end
4. ✅ Connecter à l'API

### Pour déployer
1. ✅ Lire [GIT_GUIDE.md](GIT_GUIDE.md)
2. ✅ Publier sur GitHub
3. ✅ Déployer sur Heroku/Render/Railway
4. ✅ Configurer MongoDB Atlas

---

## 💡 Astuces

### Réinitialiser complètement la base
```bash
npm run seed
```

### Voir les logs en temps réel
```bash
# L'application utilise nodemon qui affiche les logs automatiquement
npm run dev
```

### Tester rapidement un endpoint
```bash
# Utiliser la documentation Swagger
open http://localhost:3000/api-docs

# Ou utiliser curl directement
curl http://localhost:3000/api/categories
```

---

## ❓ Questions Fréquentes

**Q: Comment créer un compte admin ?**  
R: Utilisez le compte créé par le seed, ou modifiez manuellement le rôle dans MongoDB.

**Q: Comment ajouter une nouvelle catégorie ?**  
R: POST `/api/categories` avec le token admin.

**Q: Comment exporter une configuration en PDF ?**  
R: GET `/api/configurations/:id/export-pdf` avec votre token.

**Q: Les tests échouent, que faire ?**  
R: Vérifiez que MongoDB est démarré et que JWT_SECRET est défini.

---

## 📞 Support

- **Documentation** : Voir les fichiers .md dans le projet
- **API Docs** : http://localhost:3000/api-docs
- **Issues** : Créer une issue sur GitHub

---

**Bon développement ! 🚀**
