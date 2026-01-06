# ConfigurateurPC - API RESTful

API RESTful complète pour la configuration de PC sur mesure développée avec Node.js, Express et MongoDB.

## 🚀 Fonctionnalités

### Gestion des Utilisateurs
- ✅ Inscription et connexion avec authentification JWT
- ✅ Gestion du profil utilisateur
- ✅ Système de rôles (utilisateur / administrateur)
- ✅ Sauvegarde de configurations multiples par utilisateur

### Gestion des Composants
- ✅ CRUD complet des catégories (CPU, GPU, RAM, etc.)
- ✅ CRUD complet des composants matériels
- ✅ Recherche et filtrage par catégorie, marque, prix
- ✅ Spécifications techniques détaillées
- ✅ Gestion des images

### Gestion des Partenaires Marchands
- ✅ CRUD complet des partenaires marchands
- ✅ Gestion des prix par partenaire pour chaque composant
- ✅ Suivi de la disponibilité en stock
- ✅ Programme d'affiliation (taux de commission, conditions)

### Gestion des Configurations
- ✅ Création de configurations PC personnalisées
- ✅ Calcul automatique du coût total
- ✅ Sélection des partenaires pour chaque composant
- ✅ Exportation en PDF
- ✅ Sauvegarde et gestion des configurations

### Sécurité
- ✅ Authentification JWT
- ✅ Hash des mots de passe avec bcrypt
- ✅ Protection des routes administrateur
- ✅ Validation des données avec express-validator

### Documentation et Tests
- ✅ Documentation OpenAPI/Swagger complète
- ✅ Tests unitaires avec Jest et Supertest
- ✅ Gestion centralisée des erreurs

## 📋 Prérequis

- Node.js >= 18.x
- MongoDB >= 5.x
- npm ou yarn

## 🔧 Installation

1. **Cloner le repository**
```bash
git clone <votre-repo-url>
cd TP-API
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```

Modifier le fichier `.env` avec vos propres valeurs :
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/configurateur-pc
JWT_SECRET=votre_secret_super_securise
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:4200
```

4. **Démarrer MongoDB**
```bash
# Si MongoDB est installé localement
mongod

# Ou utiliser Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

5. **Lancer l'application**
```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

L'API sera accessible sur `http://localhost:3000`

## 📚 Documentation API

Une fois l'application lancée, accédez à la documentation Swagger :
```
http://localhost:3000/api-docs
```

### Endpoints Principaux

#### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur
- `PUT /api/auth/me` - Mise à jour du profil

#### Utilisateurs (Admin uniquement)
- `GET /api/users` - Liste des utilisateurs
- `GET /api/users/:id` - Détails d'un utilisateur
- `PUT /api/users/:id` - Modifier un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur

#### Catégories
- `GET /api/categories` - Liste des catégories
- `GET /api/categories/:id` - Détails d'une catégorie
- `POST /api/categories` - Créer une catégorie (Admin)
- `PUT /api/categories/:id` - Modifier une catégorie (Admin)
- `DELETE /api/categories/:id` - Supprimer une catégorie (Admin)

#### Composants
- `GET /api/components` - Liste des composants (avec filtres)
- `GET /api/components/:id` - Détails d'un composant
- `POST /api/components` - Créer un composant (Admin)
- `PUT /api/components/:id` - Modifier un composant (Admin)
- `DELETE /api/components/:id` - Supprimer un composant (Admin)
- `POST /api/components/:id/partner-prices` - Ajouter un prix partenaire (Admin)
- `PUT /api/components/:componentId/partner-prices/:priceId` - Modifier un prix (Admin)
- `DELETE /api/components/:componentId/partner-prices/:priceId` - Supprimer un prix (Admin)

#### Partenaires
- `GET /api/partners` - Liste des partenaires
- `GET /api/partners/:id` - Détails d'un partenaire
- `POST /api/partners` - Créer un partenaire (Admin)
- `PUT /api/partners/:id` - Modifier un partenaire (Admin)
- `DELETE /api/partners/:id` - Supprimer un partenaire (Admin)

#### Configurations
- `GET /api/configurations` - Mes configurations
- `GET /api/configurations/all` - Toutes les configurations (Admin)
- `GET /api/configurations/:id` - Détails d'une configuration
- `POST /api/configurations` - Créer une configuration
- `PUT /api/configurations/:id` - Modifier une configuration
- `DELETE /api/configurations/:id` - Supprimer une configuration
- `GET /api/configurations/:id/calculate` - Calculer le coût total
- `GET /api/configurations/:id/export-pdf` - Exporter en PDF

## 🧪 Tests

Exécuter les tests unitaires :
```bash
# Tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Tests avec couverture de code
npm run test:coverage
```

## 📁 Structure du Projet

```
TP-API/
├── config/
│   ├── database.js          # Configuration MongoDB
│   └── swagger.js            # Configuration Swagger/OpenAPI
├── middleware/
│   ├── auth.js               # Authentification JWT
│   ├── validate.js           # Validation des données
│   └── errorHandler.js       # Gestion des erreurs
├── models/
│   ├── User.js               # Modèle Utilisateur
│   ├── Category.js           # Modèle Catégorie
│   ├── Component.js          # Modèle Composant
│   ├── Partner.js            # Modèle Partenaire
│   └── Configuration.js      # Modèle Configuration
├── routes/
│   ├── auth.js               # Routes d'authentification
│   ├── users.js              # Routes utilisateurs
│   ├── categories.js         # Routes catégories
│   ├── components.js         # Routes composants
│   ├── partners.js           # Routes partenaires
│   └── configurations.js     # Routes configurations
├── tests/
│   ├── auth.test.js          # Tests authentification
│   ├── categories.test.js    # Tests catégories
│   ├── configurations.test.js # Tests configurations
│   └── setup.js              # Configuration des tests
├── .env.example              # Exemple de variables d'environnement
├── .gitignore
├── app.js                    # Point d'entrée de l'application
├── jest.config.js            # Configuration Jest
├── package.json
└── README.md
```

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification.

1. **S'inscrire ou se connecter** pour obtenir un token
2. **Inclure le token** dans le header `Authorization` :
```
Authorization: Bearer <votre_token>
```

Exemple avec curl :
```bash
# Inscription
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Connexion
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Utiliser le token
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <votre_token>"
```

## 👥 Rôles et Permissions

- **Utilisateur** (`user`) :
  - Peut créer, lire, modifier et supprimer ses propres configurations
  - Peut lire toutes les catégories, composants et partenaires
  - Peut modifier son profil

- **Administrateur** (`admin`) :
  - Tous les droits de l'utilisateur
  - CRUD sur tous les composants, catégories et partenaires
  - Gestion complète des utilisateurs
  - Accès à toutes les configurations

## 🌐 CORS

L'API supporte CORS. Configurez les origines autorisées dans le fichier `.env` :
```env
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:4200,https://votredomaine.com
```

## 📦 Export PDF

Les configurations peuvent être exportées en PDF avec toutes les informations :
- Nom et description de la configuration
- Informations de l'utilisateur
- Liste détaillée des composants
- Prix unitaires et quantités
- Coût total

```bash
GET /api/configurations/:id/export-pdf
```

## 🚧 Développement Futur

- [ ] Interface Back-Office (React/Angular)
- [ ] Vérification de compatibilité des composants
- [ ] Système de comparaison de configurations
- [ ] Notifications par email
- [ ] Synchronisation automatique des prix partenaires
- [ ] Upload d'images vers un service cloud
- [ ] Système de cache (Redis)
- [ ] Rate limiting

## 📄 Licence

MIT

## 👨‍💻 Auteur

Développé dans le cadre du projet IPI - Alternance 2024-2026

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📞 Support

Pour toute question ou problème, veuillez ouvrir une issue sur le repository.
