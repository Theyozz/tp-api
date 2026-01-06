# 🔄 Guide Git - ConfigurateurPC API

## 📝 Initialisation du Repository Git

### 1. Initialiser Git
```bash
cd /Users/theovm/Desktop/Alternance/Alternance\ 2024-2026/IPI/TP-API
git init
```

### 2. Ajouter tous les fichiers
```bash
git add .
```

### 3. Premier commit
```bash
git commit -m "Initial commit - ConfigurateurPC API complete

Features:
- RESTful API with Node.js & Express
- MongoDB models (User, Category, Component, Partner, Configuration)
- JWT authentication with role-based access
- Complete CRUD operations
- PDF export for configurations
- Swagger/OpenAPI documentation
- Jest unit tests
- Seed data script
- Complete documentation"
```

---

## 🌐 Publier sur GitHub

### Option 1 : Créer un nouveau repository sur GitHub

1. **Aller sur GitHub.com**
2. **Cliquer sur "New repository"**
3. **Remplir les informations** :
   - Repository name: `configurateur-pc-api`
   - Description: `API RESTful pour la configuration de PC sur mesure`
   - Public ou Private selon vos besoins
   - **NE PAS** initialiser avec README, .gitignore ou LICENSE (vous les avez déjà)

4. **Lier votre repository local au repository GitHub** :
```bash
git remote add origin https://github.com/VOTRE_USERNAME/configurateur-pc-api.git
git branch -M main
git push -u origin main
```

### Option 2 : Utiliser GitHub CLI

```bash
# Installer GitHub CLI (si pas déjà fait)
brew install gh

# Se connecter
gh auth login

# Créer et publier le repository
gh repo create configurateur-pc-api --public --source=. --remote=origin --push
```

---

## 📁 Structure des Commits Recommandée

Si vous souhaitez avoir un historique de commits plus détaillé, voici une structure suggérée :

```bash
# Au lieu d'un seul gros commit, vous pouvez faire :

git add package.json package-lock.json
git commit -m "chore: setup Node.js project with dependencies"

git add models/
git commit -m "feat: add MongoDB models (User, Category, Component, Partner, Configuration)"

git add middleware/
git commit -m "feat: add authentication and validation middleware"

git add routes/
git commit -m "feat: add all API routes with complete CRUD operations"

git add config/
git commit -m "feat: add database and Swagger configuration"

git add tests/
git commit -m "test: add Jest unit tests for auth, categories, and configurations"

git add seed.js
git commit -m "feat: add database seeding script"

git add README.md QUICK_START.md BACKOFFICE.md PROJET_SYNTHESE.md
git commit -m "docs: add complete project documentation"

git add .env.example .gitignore
git commit -m "chore: add environment config and gitignore"
```

---

## 🏷️ Tags pour les Versions

Créer des tags pour marquer les versions importantes :

```bash
# Version 1.0.0 - Version initiale complète
git tag -a v1.0.0 -m "Version 1.0.0 - Complete API with all features

- User authentication with JWT
- Complete CRUD for all entities
- PDF export
- Swagger documentation
- Unit tests"

# Pousser le tag
git push origin v1.0.0
```

---

## 🌿 Workflow Git Recommandé

### Branches principales
```
main (ou master) - Code de production
develop - Code en développement
```

### Branches de fonctionnalités
```bash
# Créer une branche pour une nouvelle fonctionnalité
git checkout -b feature/nom-de-la-fonctionnalite

# Travailler sur la fonctionnalité
git add .
git commit -m "feat: description de la fonctionnalité"

# Fusionner dans develop
git checkout develop
git merge feature/nom-de-la-fonctionnalite

# Supprimer la branche
git branch -d feature/nom-de-la-fonctionnalite
```

---

## 📝 Convention de Commits

Utiliser la convention **Conventional Commits** :

```
<type>(<scope>): <description>

[corps optionnel]

[pied de page optionnel]
```

### Types courants :
- **feat**: Nouvelle fonctionnalité
- **fix**: Correction de bug
- **docs**: Documentation uniquement
- **style**: Formatage, pas de changement de code
- **refactor**: Refactorisation du code
- **test**: Ajout ou modification de tests
- **chore**: Maintenance (dépendances, config, etc.)

### Exemples :
```bash
git commit -m "feat(auth): add password reset functionality"
git commit -m "fix(components): correct price calculation bug"
git commit -m "docs(readme): update installation instructions"
git commit -m "test(configurations): add PDF export tests"
git commit -m "chore(deps): update mongoose to v9.2.0"
```

---

## 🔒 Fichiers à ne JAMAIS Commiter

Le `.gitignore` est déjà configuré, mais rappel important :

❌ **JAMAIS commiter :**
- `.env` (contient des secrets !)
- `node_modules/`
- Fichiers de logs
- Fichiers temporaires
- Clés API ou tokens

✅ **Toujours commiter :**
- `.env.example` (template sans valeurs sensibles)
- Code source
- Documentation
- Fichiers de configuration (sauf secrets)

---

## 📊 Vérifier l'État du Repository

```bash
# Voir le statut
git status

# Voir l'historique
git log --oneline --graph --all

# Voir les fichiers ignorés
git status --ignored

# Voir les différences
git diff
```

---

## 🔄 Commandes Git Utiles

### Annuler des changements
```bash
# Annuler les modifications d'un fichier
git checkout -- fichier.js

# Annuler le dernier commit (garde les changements)
git reset --soft HEAD~1

# Annuler le dernier commit (supprime les changements)
git reset --hard HEAD~1
```

### Nettoyer le repository
```bash
# Supprimer les fichiers non suivis
git clean -fd

# Voir ce qui serait supprimé
git clean -fd --dry-run
```

### Synchroniser avec le remote
```bash
# Récupérer les changements
git pull origin main

# Pousser les changements
git push origin main

# Pousser tous les tags
git push --tags
```

---

## 📦 .gitignore (Déjà Créé)

Le fichier `.gitignore` inclut :
```
node_modules/
.env
.env.local
*.log
coverage/
.DS_Store
dist/
build/
```

---

## 🚀 Workflow de Publication

### Première publication
```bash
# 1. Initialiser Git
git init

# 2. Ajouter tous les fichiers
git add .

# 3. Premier commit
git commit -m "Initial commit - Complete ConfigurateurPC API"

# 4. Créer le repository sur GitHub (via l'interface web ou gh cli)

# 5. Lier et pousser
git remote add origin https://github.com/VOTRE_USERNAME/configurateur-pc-api.git
git branch -M main
git push -u origin main

# 6. Créer un tag de version
git tag -a v1.0.0 -m "Version 1.0.0 - Complete API"
git push origin v1.0.0
```

### Mises à jour futures
```bash
# 1. Faire les modifications

# 2. Ajouter les changements
git add .

# 3. Commit
git commit -m "feat: add new feature"

# 4. Pousser
git push origin main

# 5. Tag pour les versions importantes
git tag -a v1.1.0 -m "Version 1.1.0 - New features"
git push origin v1.1.0
```

---

## 📖 README.md pour GitHub

Le `README.md` est déjà complet et inclut :
- ✅ Description du projet
- ✅ Badges (vous pouvez en ajouter)
- ✅ Installation
- ✅ Configuration
- ✅ Utilisation
- ✅ Documentation API
- ✅ Tests
- ✅ Structure du projet
- ✅ Contribution
- ✅ Licence

### Badges optionnels à ajouter au début du README.md :
```markdown
![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![MongoDB](https://img.shields.io/badge/mongodb-%3E%3D5.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)
```

---

## 🔐 Sécurité Git

### Avant de pousser, vérifier :
```bash
# 1. Vérifier qu'aucun secret n'est dans les fichiers
grep -r "password" --exclude-dir=node_modules .
grep -r "secret" --exclude-dir=node_modules .
grep -r "api_key" --exclude-dir=node_modules .

# 2. Vérifier le .gitignore
cat .gitignore

# 3. Vérifier les fichiers qui seront poussés
git status
```

### Si un secret a été commité par erreur :
```bash
# DANGER : Réécrit l'historique !
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Forcer le push (attention !)
git push origin --force --all
```

---

## 📞 Liens Utiles

- **GitHub Docs** : https://docs.github.com
- **Git Docs** : https://git-scm.com/doc
- **Conventional Commits** : https://www.conventionalcommits.org
- **Gitignore.io** : https://www.toptal.com/developers/gitignore

---

## ✅ Checklist Avant Publication

- [ ] `.env` est dans `.gitignore`
- [ ] `node_modules/` est dans `.gitignore`
- [ ] Pas de secrets/mots de passe dans le code
- [ ] README.md est complet
- [ ] Tests passent (`npm test`)
- [ ] Code est commenté
- [ ] Documentation à jour
- [ ] `.env.example` est présent
- [ ] package.json est correct
- [ ] License choisie (MIT recommandé)

---

**Votre projet est prêt à être partagé ! 🎉**
