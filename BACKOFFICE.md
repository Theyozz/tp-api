# Back-Office - ConfigurateurPC

## 📋 Spécifications du Back-Office

Interface d'administration pour la gestion complète de l'API ConfigurateurPC.

### Technologies Recommandées

**Option 1 : React**
- React 18+
- React Router pour la navigation
- Axios pour les appels API
- Material-UI ou Ant Design pour les composants
- React Query pour la gestion du state serveur
- Recharts pour les graphiques

**Option 2 : Angular**
- Angular 16+
- Angular Material pour les composants
- RxJS pour la gestion des données asynchrones
- NgRx pour la gestion d'état (optionnel)
- Chart.js ou ng2-charts pour les graphiques

---

## 🎨 Fonctionnalités Requises

### 1. Authentification
- [x] Page de connexion sécurisée
- [x] Gestion du token JWT
- [x] Déconnexion
- [x] Protection des routes

### 2. Dashboard
- [ ] Vue d'ensemble des statistiques
  - Nombre total d'utilisateurs
  - Nombre total de composants
  - Nombre total de configurations
  - Nombre total de partenaires
- [ ] Graphiques
  - Configurations créées par jour/semaine/mois
  - Composants les plus populaires
  - Revenus estimés par partenaire

### 3. Gestion des Utilisateurs
**Liste des utilisateurs** (`/users`)
- [ ] Table avec pagination
- [ ] Filtres : nom, email, rôle
- [ ] Recherche dynamique
- [ ] Tri par colonnes

**Détails d'un utilisateur** (`/users/:id`)
- [ ] Informations du profil
- [ ] Liste de ses configurations
- [ ] Historique d'activité
- [ ] Actions : modifier, supprimer

**Actions**
- [ ] Modifier le rôle (user ↔ admin)
- [ ] Réinitialiser le mot de passe
- [ ] Désactiver/Activer un compte
- [ ] Supprimer un utilisateur

### 4. Gestion des Catégories
**Liste des catégories** (`/categories`)
- [ ] Table avec toutes les catégories
- [ ] Nombre de composants par catégorie
- [ ] Actions : ajouter, modifier, supprimer

**Formulaire catégorie**
- [ ] Nom *
- [ ] Description
- [ ] Icône (URL ou upload)
- [ ] Validation

### 5. Gestion des Composants
**Liste des composants** (`/components`)
- [ ] Table avec pagination
- [ ] Filtres : catégorie, marque, prix, statut
- [ ] Recherche full-text
- [ ] Tri par colonnes
- [ ] Indicateur de stock (via partenaires)

**Formulaire composant** (`/components/new` ou `/components/:id/edit`)
- [ ] Catégorie * (select)
- [ ] Marque *
- [ ] Titre *
- [ ] Modèle *
- [ ] Description (textarea)
- [ ] Prix de base *
- [ ] Image (URL ou upload)
- [ ] Spécifications techniques (key-value pairs)
- [ ] Statut actif/inactif
- [ ] Validation

**Gestion des prix partenaires**
- [ ] Liste des prix pour chaque partenaire
- [ ] Ajouter un prix partenaire
- [ ] Modifier un prix
- [ ] Supprimer un prix
- [ ] Indicateur de disponibilité

### 6. Gestion des Partenaires
**Liste des partenaires** (`/partners`)
- [ ] Table avec tous les partenaires
- [ ] Filtres : statut actif/inactif
- [ ] Nombre de composants référencés

**Formulaire partenaire** (`/partners/new` ou `/partners/:id/edit`)
- [ ] Nom *
- [ ] Site web * (URL)
- [ ] Logo (URL ou upload)
- [ ] Email de contact
- [ ] Programme d'affiliation
  - Taux de commission
  - ID d'affiliation
  - Conditions
- [ ] Paramètres de synchronisation
  - Clé API
  - URL API
  - Auto-sync activé
- [ ] Statut actif/inactif
- [ ] Validation

### 7. Gestion des Configurations
**Liste des configurations** (`/configurations`)
- [ ] Table avec pagination
- [ ] Filtres : utilisateur, date de création
- [ ] Recherche par nom
- [ ] Coût total affiché
- [ ] Nombre de composants

**Détails d'une configuration** (`/configurations/:id`)
- [ ] Informations générales
  - Nom
  - Description
  - Utilisateur
  - Date de création
  - Coût total
- [ ] Liste détaillée des composants
  - Composant
  - Partenaire sélectionné
  - Prix
  - Quantité
  - Sous-total
- [ ] Actions
  - Modifier
  - Supprimer
  - Exporter en PDF
  - Dupliquer

**Actions**
- [ ] Modifier une configuration
- [ ] Supprimer une configuration
- [ ] Voir l'historique des modifications

---

## 🏗️ Structure Proposée

### React (avec React Router et Material-UI)

```
backoffice/
├── public/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── Auth/
│   │   │   └── LoginForm.jsx
│   │   ├── Dashboard/
│   │   │   ├── StatsCard.jsx
│   │   │   └── Charts.jsx
│   │   ├── Users/
│   │   │   ├── UsersList.jsx
│   │   │   ├── UserDetail.jsx
│   │   │   └── UserForm.jsx
│   │   ├── Categories/
│   │   │   ├── CategoriesList.jsx
│   │   │   └── CategoryForm.jsx
│   │   ├── Components/
│   │   │   ├── ComponentsList.jsx
│   │   │   ├── ComponentForm.jsx
│   │   │   └── PartnerPrices.jsx
│   │   ├── Partners/
│   │   │   ├── PartnersList.jsx
│   │   │   └── PartnerForm.jsx
│   │   ├── Configurations/
│   │   │   ├── ConfigurationsList.jsx
│   │   │   ├── ConfigurationDetail.jsx
│   │   │   └── ConfigurationForm.jsx
│   │   └── Common/
│   │       ├── DataTable.jsx
│   │       ├── SearchBar.jsx
│   │       ├── ConfirmDialog.jsx
│   │       └── Loading.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Users.jsx
│   │   ├── Categories.jsx
│   │   ├── Components.jsx
│   │   ├── Partners.jsx
│   │   └── Configurations.jsx
│   ├── services/
│   │   ├── api.js              # Configuration Axios
│   │   ├── authService.js      # Gestion auth
│   │   ├── userService.js      # API Users
│   │   ├── categoryService.js  # API Categories
│   │   ├── componentService.js # API Components
│   │   ├── partnerService.js   # API Partners
│   │   └── configService.js    # API Configurations
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   └── useDebounce.js
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── utils/
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── App.jsx
│   ├── index.jsx
│   └── routes.jsx
├── package.json
└── README.md
```

### Angular (avec Angular Material)

```
backoffice/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   └── auth.interceptor.ts
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   ├── category.service.ts
│   │   │   │   ├── component.service.ts
│   │   │   │   ├── partner.service.ts
│   │   │   │   └── configuration.service.ts
│   │   │   └── models/
│   │   │       ├── user.model.ts
│   │   │       ├── category.model.ts
│   │   │       ├── component.model.ts
│   │   │       ├── partner.model.ts
│   │   │       └── configuration.model.ts
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── data-table/
│   │   │   │   ├── confirm-dialog/
│   │   │   │   └── loading/
│   │   │   └── shared.module.ts
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── users/
│   │   │   ├── categories/
│   │   │   ├── components/
│   │   │   ├── partners/
│   │   │   └── configurations/
│   │   ├── layouts/
│   │   │   ├── admin-layout/
│   │   │   └── auth-layout/
│   │   ├── app-routing.module.ts
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   ├── assets/
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   └── index.html
├── angular.json
├── package.json
└── tsconfig.json
```

---

## 🔐 Authentification

### Configuration de l'API
```javascript
// services/api.js (React) ou auth.interceptor.ts (Angular)

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Rediriger vers la page de connexion
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Service d'authentification
```javascript
// services/authService.js

import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { token, user };
  },

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  isAdmin() {
    const user = this.getUser();
    return user?.role === 'admin';
  }
};
```

---

## 📊 Exemples d'Interface

### Dashboard
```
┌─────────────────────────────────────────────────────────┐
│  Dashboard                                      👤 Admin │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│  │ 👥 1,234  │  │ 💻 156   │  │ 📦 89    │  │ 🤝 12    ││
│  │Users      │  │Components│  │Configs   │  │Partners  ││
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘│
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Configurations créées (30 derniers jours)        │ │
│  │  [Graphique en ligne]                             │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌──────────────────────────┐ ┌─────────────────────┐  │
│  │ Composants les plus      │ │ Dernières configs   │  │
│  │ populaires               │ │                     │  │
│  │ [Graphique en barres]    │ │ - Config Gaming     │  │
│  │                          │ │ - Config Bureautique│  │
│  └──────────────────────────┘ └─────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Liste des Composants
```
┌─────────────────────────────────────────────────────────┐
│  Composants                            [+ Nouveau]       │
├─────────────────────────────────────────────────────────┤
│  🔍 Recherche...   [Catégorie ▼] [Marque ▼] [Actif ▼]  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Catégorie    │ Marque  │ Titre         │ Prix  │ ⚙️   │
│  ────────────────────────────────────────────────────── │
│  CPU          │ Intel   │ Core i9-13900K│ 599€  │ ✏️ 🗑️│
│  GPU          │ NVIDIA  │ RTX 4090      │ 1899€ │ ✏️ 🗑️│
│  RAM          │ Corsair │ Vengeance 32GB│ 149€  │ ✏️ 🗑️│
│  Storage      │ Samsung │ 990 PRO 2TB   │ 189€  │ ✏️ 🗑️│
│                                                          │
│  ◄ 1 2 3 ... 10 ►                    156 composants     │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Installation du Back-Office

### Avec React
```bash
# Créer l'application React
npx create-react-app configurateur-backoffice
cd configurateur-backoffice

# Installer les dépendances
npm install @mui/material @emotion/react @emotion/styled
npm install react-router-dom axios react-query
npm install recharts date-fns

# Lancer le dev server
npm start
```

### Avec Angular
```bash
# Créer l'application Angular
ng new configurateur-backoffice
cd configurateur-backoffice

# Installer Angular Material
ng add @angular/material

# Installer les dépendances
npm install chart.js ng2-charts

# Lancer le dev server
ng serve
```

---

## 📡 Endpoints API à Utiliser

Consultez le fichier `README.md` principal pour la liste complète des endpoints de l'API.

**Important** : Assurez-vous que l'API est démarrée sur `http://localhost:3000` avant de lancer le Back-Office.

---

## ✅ Checklist de Développement

### Phase 1 : Setup
- [ ] Initialiser le projet (React ou Angular)
- [ ] Configurer le routing
- [ ] Installer les dépendances UI
- [ ] Créer la structure de dossiers

### Phase 2 : Authentification
- [ ] Page de connexion
- [ ] Service d'authentification
- [ ] Protection des routes
- [ ] Gestion du token JWT

### Phase 3 : Layout
- [ ] Sidebar de navigation
- [ ] Header avec profil
- [ ] Layout principal responsive

### Phase 4 : Dashboard
- [ ] Cartes de statistiques
- [ ] Graphiques
- [ ] Vue d'ensemble

### Phase 5 : CRUD Entities
- [ ] Gestion des catégories
- [ ] Gestion des composants
- [ ] Gestion des partenaires
- [ ] Gestion des utilisateurs
- [ ] Gestion des configurations

### Phase 6 : Fonctionnalités avancées
- [ ] Recherche et filtres
- [ ] Pagination
- [ ] Upload d'images
- [ ] Export PDF
- [ ] Validation de formulaires
- [ ] Messages de confirmation

### Phase 7 : Tests et déploiement
- [ ] Tests unitaires
- [ ] Tests e2e
- [ ] Build de production
- [ ] Déploiement

---

**Bon développement ! 🎨**
