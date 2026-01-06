# Guide de Démarrage Rapide - ConfigurateurPC API

## ⚡ Installation Rapide

### 1. Prérequis
- Node.js 18+ installé
- MongoDB installé et en cours d'exécution

### 2. Installation
```bash
# Cloner le projet
git clone <votre-repo>
cd TP-API

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env
```

### 3. Configuration

Éditez le fichier `.env` et configurez au minimum :
```env
MONGODB_URI=mongodb://localhost:27017/configurateur-pc
JWT_SECRET=changez_ce_secret_en_production
```

### 4. Peupler la base de données (optionnel)
```bash
npm run seed
```

Cela créera :
- Un compte admin : `admin@configurateurpc.com` / `admin123`
- Un compte user : `user@example.com` / `user123`
- Des catégories, composants, partenaires et configurations de test

### 5. Lancer l'application
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

L'API sera disponible sur : **http://localhost:3000**
Documentation Swagger : **http://localhost:3000/api-docs**

---

## 🚀 Tester l'API

### 1. Créer un compte utilisateur
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

Réponse :
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Copiez le token** pour les prochaines requêtes !

### 2. Se connecter
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Récupérer les catégories
```bash
curl http://localhost:3000/api/categories
```

### 4. Récupérer les composants
```bash
# Tous les composants
curl http://localhost:3000/api/components

# Filtrer par catégorie
curl "http://localhost:3000/api/components?category=CATEGORY_ID"

# Filtrer par marque
curl "http://localhost:3000/api/components?brand=Intel"

# Recherche
curl "http://localhost:3000/api/components?search=gaming"
```

### 5. Créer une configuration
```bash
curl -X POST http://localhost:3000/api/configurations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -d '{
    "name": "Ma config gaming",
    "description": "PC pour le gaming 4K",
    "components": [
      {
        "component": "COMPONENT_ID_1",
        "price": 599.99,
        "quantity": 1
      },
      {
        "component": "COMPONENT_ID_2",
        "price": 189.99,
        "quantity": 1
      }
    ]
  }'
```

### 6. Exporter une configuration en PDF
```bash
curl -X GET http://localhost:3000/api/configurations/CONFIG_ID/export-pdf \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  --output ma-config.pdf
```

---

## 🧪 Lancer les Tests

```bash
# Tous les tests
npm test

# Avec couverture
npm run test:coverage
```

---

## 🔐 Authentification

Pour toutes les routes protégées, ajoutez le header :
```
Authorization: Bearer VOTRE_TOKEN
```

### Routes publiques (pas de token requis)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/categories`
- `GET /api/categories/:id`
- `GET /api/components`
- `GET /api/components/:id`
- `GET /api/partners`
- `GET /api/partners/:id`

### Routes utilisateur authentifié
- `GET /api/auth/me`
- `PUT /api/auth/me`
- `GET /api/configurations`
- `POST /api/configurations`
- `PUT /api/configurations/:id`
- `DELETE /api/configurations/:id`
- `GET /api/configurations/:id/export-pdf`

### Routes admin uniquement
- Toutes les routes `POST`, `PUT`, `DELETE` pour :
  - Categories
  - Components
  - Partners
- `GET /api/users`
- `GET /api/configurations/all`

---

## 📊 Base de données

### Structure MongoDB
```
configurateur-pc/
  ├── users
  ├── categories
  ├── components
  ├── partners
  └── configurations
```

### Voir les données avec MongoDB Compass
- URL de connexion : `mongodb://localhost:27017`
- Base de données : `configurateur-pc`

---

## 🛠️ Commandes Utiles

```bash
# Développement
npm run dev           # Lancer avec nodemon (auto-reload)
npm start            # Lancer en production

# Tests
npm test             # Tests unitaires
npm run test:watch   # Tests en mode watch
npm run test:coverage # Tests avec couverture

# Base de données
npm run seed         # Peupler la base avec des données de test

# Dépendances
npm install          # Installer les dépendances
npm update           # Mettre à jour les dépendances
```

---

## 🐛 Dépannage

### MongoDB ne se connecte pas
```bash
# Vérifier que MongoDB est en cours d'exécution
mongod

# Ou avec Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Port 3000 déjà utilisé
Changez le port dans `.env` :
```env
PORT=3001
```

### Erreur "JWT_SECRET is not defined"
Assurez-vous que le fichier `.env` existe et contient :
```env
JWT_SECRET=votre_secret
```

---

## 📚 Ressources

- **Documentation API** : http://localhost:3000/api-docs
- **Repo GitHub** : [Votre repo]
- **MongoDB Docs** : https://docs.mongodb.com
- **Express Docs** : https://expressjs.com

---

## ✨ Prochaines Étapes

1. Créez un compte administrateur
2. Ajoutez des catégories de composants
3. Ajoutez des partenaires marchands
4. Ajoutez des composants avec leurs prix
5. Testez la création de configurations
6. Exportez en PDF

**Bon développement ! 🚀**
