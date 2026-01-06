# 🏗️ Architecture Technique - ConfigurateurPC API

## 📋 Vue d'Ensemble

L'API ConfigurateurPC est construite selon une architecture **MVC (Model-View-Controller)** adaptée pour une API RESTful, avec une séparation claire des responsabilités.

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│          (Front-end, Mobile App, Postman, etc.)             │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP Requests
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                      EXPRESS.JS                              │
│                   (API RESTful)                              │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Middleware  │→ │    Routes    │→ │ Controllers  │      │
│  │  (Auth, etc) │  │  (Endpoints) │  │   (Logic)    │      │
│  └──────────────┘  └──────────────┘  └──────┬───────┘      │
│                                              ↓               │
│                                      ┌──────────────┐        │
│                                      │    Models    │        │
│                                      │  (Mongoose)  │        │
│                                      └──────┬───────┘        │
└─────────────────────────────────────────────┼───────────────┘
                                              ↓
                                      ┌──────────────┐
                                      │   MongoDB    │
                                      │  (Database)  │
                                      └──────────────┘
```

---

## 🔧 Stack Technique

### Backend
- **Runtime** : Node.js 18+
- **Framework** : Express.js 5.x
- **Langage** : JavaScript (ES6+)

### Base de Données
- **SGBD** : MongoDB 5+
- **ODM** : Mongoose 9.x
- **Schémas** : 5 modèles (User, Category, Component, Partner, Configuration)

### Authentification & Sécurité
- **Auth** : JWT (JSON Web Tokens)
- **Hash** : bcryptjs
- **Validation** : express-validator
- **CORS** : cors middleware

### Documentation
- **Standard** : OpenAPI 3.0
- **UI** : Swagger UI Express
- **Generator** : swagger-jsdoc

### Tests
- **Framework** : Jest 29+
- **HTTP Testing** : Supertest 7+
- **Coverage** : Jest built-in

### Outils de Développement
- **Auto-reload** : Nodemon
- **Variables d'env** : dotenv
- **PDF Generation** : PDFKit

---

## 📁 Architecture des Dossiers

```
TP-API/
│
├── 📂 config/               # Configuration de l'application
│   ├── database.js          # Connexion MongoDB
│   └── swagger.js           # Config OpenAPI/Swagger
│
├── 📂 middleware/           # Middlewares Express
│   ├── auth.js              # JWT authentication & authorization
│   ├── validate.js          # Validation des requêtes
│   └── errorHandler.js      # Gestion centralisée des erreurs
│
├── 📂 models/               # Modèles Mongoose (Schémas)
│   ├── User.js              # Utilisateurs et authentification
│   ├── Category.js          # Catégories de composants
│   ├── Component.js         # Composants matériels
│   ├── Partner.js           # Partenaires marchands
│   └── Configuration.js     # Configurations PC
│
├── 📂 routes/               # Routes Express (API Endpoints)
│   ├── auth.js              # /api/auth/*
│   ├── users.js             # /api/users/*
│   ├── categories.js        # /api/categories/*
│   ├── components.js        # /api/components/*
│   ├── partners.js          # /api/partners/*
│   └── configurations.js    # /api/configurations/*
│
├── 📂 tests/                # Tests unitaires et d'intégration
│   ├── auth.test.js         # Tests authentification
│   ├── categories.test.js   # Tests catégories
│   ├── configurations.test.js # Tests configurations
│   └── setup.js             # Configuration globale des tests
│
├── 📄 app.js                # Point d'entrée principal
├── 📄 seed.js               # Script de peuplement de la BD
├── 📄 jest.config.js        # Configuration Jest
├── 📄 package.json          # Dépendances et scripts
├── 📄 .env                  # Variables d'environnement (local)
├── 📄 .env.example          # Template des variables
└── 📄 .gitignore            # Fichiers ignorés par Git
```

---

## 🔄 Flux de Données

### Exemple : Créer une Configuration

```
1. CLIENT
   ↓ POST /api/configurations + JWT Token
   
2. EXPRESS MIDDLEWARE (app.js)
   ↓ CORS → JSON Parser → Routes
   
3. AUTHENTICATION MIDDLEWARE (middleware/auth.js)
   ↓ Vérifier token JWT
   ↓ Décoder userId
   ↓ Charger User depuis MongoDB
   ↓ Attacher user à req.user
   
4. VALIDATION MIDDLEWARE (middleware/validate.js)
   ↓ Valider les données du body
   ↓ Si erreur → 400 Bad Request
   
5. ROUTE HANDLER (routes/configurations.js)
   ↓ Vérifier que les composants existent
   ↓ Créer l'objet Configuration
   
6. MODEL (models/Configuration.js)
   ↓ Calculer totalCost (pre-save hook)
   ↓ Sauvegarder dans MongoDB
   
7. RESPONSE
   ↓ 201 Created + Configuration JSON
   
8. CLIENT
   ← Reçoit la réponse
```

---

## 🔐 Système d'Authentification

### Flow d'Authentification

```
┌─────────────────────────────────────────────────────────┐
│                    INSCRIPTION                           │
└─────────────────────────────────────────────────────────┘
Client → POST /api/auth/register
         { email, password, name }
         ↓
Server → Valide les données
         ↓
Server → Hash le password (bcrypt)
         ↓
Server → Crée User dans MongoDB
         ↓
Server → Génère JWT token
         ↓
Client ← { user, token }

┌─────────────────────────────────────────────────────────┐
│                     CONNEXION                            │
└─────────────────────────────────────────────────────────┘
Client → POST /api/auth/login
         { email, password }
         ↓
Server → Trouve User par email
         ↓
Server → Compare password avec hash (bcrypt)
         ↓
Server → Génère JWT token
         ↓
Client ← { user, token }

┌─────────────────────────────────────────────────────────┐
│                  REQUÊTE PROTÉGÉE                        │
└─────────────────────────────────────────────────────────┘
Client → GET /api/auth/me
         Header: Authorization: Bearer <token>
         ↓
Middleware → Extrait le token
         ↓
Middleware → Vérifie et décode le token (JWT)
         ↓
Middleware → Charge User depuis MongoDB
         ↓
Middleware → Attache user à req.user
         ↓
Route → Utilise req.user
         ↓
Client ← { user }
```

### Structure du Token JWT

```javascript
{
  // Header
  "alg": "HS256",
  "typ": "JWT",
  
  // Payload
  "userId": "507f1f77bcf86cd799439011",
  "iat": 1704067200,  // Issued at
  "exp": 1704672000   // Expiration
}

// Signature
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  JWT_SECRET
)
```

---

## 💾 Modèles de Données

### Relations entre les Modèles

```
┌─────────────┐
│    User     │
│  (1 user)   │
└──────┬──────┘
       │ has many
       ↓
┌─────────────────┐
│ Configuration   │
│ (0..n configs)  │
└────────┬────────┘
         │ contains many
         ↓
    ┌────────────┐
    │ Component  │──── belongs to ───→ ┌──────────┐
    │            │                     │ Category │
    └─────┬──────┘                     └──────────┘
          │ has many prices from
          ↓
    ┌──────────┐
    │ Partner  │
    └──────────┘
```

### Schémas Mongoose Détaillés

#### User
```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  configurations: [ObjectId] (ref: Configuration),
  timestamps: true
}
```

#### Category
```javascript
{
  name: String (required, unique),
  slug: String (auto-generated, unique),
  description: String,
  icon: String,
  timestamps: true
}
```

#### Component
```javascript
{
  category: ObjectId (ref: Category, required),
  brand: String (required),
  title: String (required),
  model: String (required),
  description: String,
  specifications: Map<String, String>,
  image: String,
  basePrice: Number (required, min: 0),
  partnerPrices: [{
    partner: ObjectId (ref: Partner),
    price: Number (required, min: 0),
    url: String,
    inStock: Boolean (default: true),
    lastUpdated: Date (default: now)
  }],
  isActive: Boolean (default: true),
  timestamps: true
}
```

#### Partner
```javascript
{
  name: String (required, unique),
  website: String (required, URL),
  logo: String,
  affiliateProgram: {
    commissionRate: Number (0-100),
    terms: String,
    affiliateId: String
  },
  syncSettings: {
    apiKey: String,
    apiUrl: String,
    lastSync: Date,
    autoSync: Boolean (default: false)
  },
  isActive: Boolean (default: true),
  contactEmail: String (email format),
  timestamps: true
}
```

#### Configuration
```javascript
{
  user: ObjectId (ref: User, required),
  name: String (required),
  description: String,
  components: [{
    component: ObjectId (ref: Component, required),
    selectedPartner: ObjectId (ref: Partner),
    price: Number (required, min: 0),
    quantity: Number (default: 1, min: 1)
  }],
  totalCost: Number (calculated, min: 0),
  isPublic: Boolean (default: false),
  tags: [String],
  timestamps: true
}
```

---

## 🛡️ Sécurité

### Mesures de Sécurité Implémentées

1. **Authentification**
   - JWT avec expiration
   - Tokens stockés côté client uniquement
   - Refresh non implémenté (à ajouter)

2. **Autorisation**
   - Middleware `authenticate` pour les routes protégées
   - Middleware `isAdmin` pour les routes admin
   - Vérification de propriété pour les configurations

3. **Validation**
   - `express-validator` sur tous les inputs
   - Sanitization automatique
   - Messages d'erreur explicites

4. **Mots de passe**
   - Hash avec bcrypt (salt rounds: 10)
   - Jamais stockés en clair
   - Jamais retournés dans les réponses

5. **CORS**
   - Configuré pour autoriser les origines spécifiques
   - Credentials supportés

6. **Protection MongoDB**
   - Mongoose sanitize (à ajouter)
   - Validation de schéma stricte
   - Indexes pour performance

### Points à Améliorer

- [ ] Rate limiting (express-rate-limit)
- [ ] Helmet.js pour headers de sécurité
- [ ] MongoDB injection protection
- [ ] XSS protection
- [ ] CSRF tokens (si cookies)
- [ ] Refresh tokens
- [ ] 2FA (Two-Factor Authentication)

---

## 📊 Performance

### Optimisations Implémentées

1. **Indexes MongoDB**
   ```javascript
   // Component.js
   componentSchema.index({ category: 1, brand: 1 });
   componentSchema.index({ title: 'text', description: 'text' });
   
   // Configuration.js
   configurationSchema.index({ user: 1, createdAt: -1 });
   ```

2. **Pagination**
   - Limite de 20 résultats par défaut
   - Skip/Limit pour les grandes collections

3. **Projection**
   - Exclusion du password dans les requêtes User
   - Population sélective des références

4. **Calculs Pré-enregistrement**
   ```javascript
   // Pre-save hook pour totalCost
   configurationSchema.pre('save', function(next) {
     this.totalCost = this.components.reduce(...);
   });
   ```

### Points à Améliorer

- [ ] Cache Redis pour données fréquentes
- [ ] Compression des réponses (compression)
- [ ] CDN pour les images
- [ ] Lazy loading des relations
- [ ] Database indexes additionnels

---

## 🧪 Stratégie de Tests

### Types de Tests

1. **Tests Unitaires**
   - Modèles Mongoose
   - Fonctions utilitaires
   - Middleware isolés

2. **Tests d'Intégration**
   - Routes complètes
   - Flux authentification
   - CRUD opérations

3. **Tests E2E** (à ajouter)
   - Scénarios complets utilisateur
   - Workflow de configuration

### Structure des Tests

```javascript
describe('Entity Endpoints', () => {
  beforeAll(async () => {
    // Setup : connexion DB, création fixtures
  });
  
  afterAll(async () => {
    // Cleanup : suppression données, fermeture connexion
  });
  
  beforeEach(async () => {
    // Reset avant chaque test
  });
  
  describe('GET /api/entity', () => {
    it('should return all entities', async () => {
      // Test
    });
  });
});
```

---

## 📦 Déploiement

### Environnements

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Development  │ →  │   Staging    │ →  │  Production  │
│  (Local)     │    │   (Test)     │    │    (Live)    │
└──────────────┘    └──────────────┘    └──────────────┘
   localhost          staging.com         api.com
   MongoDB local      MongoDB Atlas      MongoDB Atlas
   Port 3000          Port 443           Port 443
```

### Checklist de Déploiement

- [ ] Variables d'environnement configurées
- [ ] MongoDB Atlas setup
- [ ] JWT_SECRET fort et unique
- [ ] CORS configuré pour le domaine
- [ ] HTTPS activé
- [ ] Logging configuré
- [ ] Monitoring en place
- [ ] Backup database automatique
- [ ] CI/CD pipeline (optionnel)

### Plateformes Recommandées

- **Heroku** : Facile, gratuit pour petits projets
- **Render** : Moderne, bon free tier
- **Railway** : Simple, bon DX
- **AWS/GCP/Azure** : Production scale
- **DigitalOcean** : VPS flexible

---

## 🔮 Évolutions Futures

### Court Terme
1. Compléter les tests (100% coverage)
2. Ajouter rate limiting
3. Implémenter refresh tokens
4. Ajouter logging (Winston)

### Moyen Terme
5. Cache Redis
6. Upload images sur S3/Cloudinary
7. Websockets pour notifications temps réel
8. GraphQL API en parallèle

### Long Terme
9. Microservices architecture
10. Event-driven avec RabbitMQ/Kafka
11. Elasticsearch pour recherche avancée
12. CI/CD complet avec tests automatisés

---

## 📚 Ressources Techniques

### Documentation Officielle
- [Node.js](https://nodejs.org/docs)
- [Express.js](https://expressjs.com)
- [MongoDB](https://docs.mongodb.com)
- [Mongoose](https://mongoosejs.com/docs)
- [JWT](https://jwt.io)
- [Jest](https://jestjs.io)

### Best Practices
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [REST API Guidelines](https://github.com/microsoft/api-guidelines)
- [Security Checklist](https://github.com/shieldfy/API-Security-Checklist)

---

**Architecture maintenue et documentée - ConfigurateurPC 2026**
