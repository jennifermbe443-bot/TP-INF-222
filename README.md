# Blog API — INF222 EC1 Taf1

> **Auteure :** MAFOGANG MBE JENNIE PRISCA — Matricule : 24G2630  
> **UE :** INF222 – Développement Backend  
> **Technologies :** Node.js · Express · SQLite (better-sqlite3) · Swagger UI

---

## Présentation

API REST complète pour la gestion d'un blog simple. Elle permet de créer, lire, modifier, supprimer et rechercher des articles, avec validation des entrées et documentation interactive via Swagger.

---

## Prérequis

- [Node.js](https://nodejs.org/) v18 ou supérieur
- npm (inclus avec Node.js)

---

## Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/<votre-username>/blog-api.git
cd blog-api

# 2. Installer les dépendances
npm install

# 3. Démarrer le serveur
npm start
# ou en mode développement (rechargement automatique)
npm run dev
```

Le serveur démarre sur **http://localhost:3000**  
La documentation Swagger est accessible sur **http://localhost:3000/api-docs**

---

## Structure du projet

```
blog-api/
├── src/
│   ├── index.js                 # Point d'entrée principal
│   ├── config/
│   │   ├── database.js          # Configuration et initialisation SQLite
│   │   └── swagger.js           # Configuration Swagger/OpenAPI
│   ├── models/
│   │   └── articleModel.js      # Opérations CRUD sur la base de données
│   ├── controllers/
│   │   └── articleController.js # Logique métier des endpoints
│   └── routes/
│       └── articleRoutes.js     # Définition des routes + annotations Swagger
├── blog.db                      # Base de données SQLite (générée automatiquement)
├── package.json
└── README.md
```

---

## Endpoints

### Articles

| Méthode | URL | Description |
|---------|-----|-------------|
| `GET` | `/api/articles` | Lister tous les articles |
| `GET` | `/api/articles?categorie=Tech` | Filtrer par catégorie |
| `GET` | `/api/articles?auteur=Alice` | Filtrer par auteur |
| `GET` | `/api/articles?date=2026-03-18` | Filtrer par date |
| `POST` | `/api/articles` | Créer un article |
| `GET` | `/api/articles/search?query=texte` | Rechercher des articles |
| `GET` | `/api/articles/:id` | Récupérer un article par ID |
| `PUT` | `/api/articles/:id` | Modifier un article |
| `DELETE` | `/api/articles/:id` | Supprimer un article |

---

## Exemples d'utilisation

### Créer un article

```http
POST /api/articles
Content-Type: application/json

{
  "titre": "Introduction à Node.js",
  "contenu": "Node.js est un environnement d'exécution JavaScript côté serveur...",
  "auteur": "MAFOGANG MBE JENNIE PRISCA",
  "date": "2026-03-22",
  "categorie": "Tech",
  "tags": ["nodejs", "backend", "javascript"]
}
```

**Réponse 201 :**
```json
{
  "success": true,
  "message": "Article créé avec succès.",
  "data": {
    "id": 1,
    "titre": "Introduction à Node.js",
    "contenu": "Node.js est un environnement d'exécution JavaScript côté serveur...",
    "auteur": "MAFOGANG MBE JENNIE PRISCA",
    "date": "2026-03-22",
    "categorie": "Tech",
    "tags": ["nodejs", "backend", "javascript"]
  }
}
```

### Récupérer tous les articles

```http
GET /api/articles
```

### Filtrer par catégorie et date

```http
GET /api/articles?categorie=Tech&date=2026-03-22
```

### Récupérer un article par ID

```http
GET /api/articles/1
```

### Modifier un article

```http
PUT /api/articles/1
Content-Type: application/json

{
  "titre": "Introduction à Node.js — Mise à jour",
  "tags": ["nodejs", "express", "api"]
}
```

### Supprimer un article

```http
DELETE /api/articles/1
```

**Réponse 200 :**
```json
{
  "success": true,
  "message": "Article supprimé avec succès."
}
```

### Rechercher des articles

```http
GET /api/articles/search?query=javascript
```

---

## Codes HTTP utilisés

| Code | Signification | Cas d'utilisation |
|------|--------------|-------------------|
| `200` | OK | Lecture, modification, suppression réussies |
| `201` | Created | Création d'un article réussie |
| `400` | Bad Request | Données manquantes ou invalides |
| `404` | Not Found | Article introuvable |
| `500` | Internal Server Error | Erreur interne du serveur |

---

## Bonnes pratiques appliquées

- **Séparation des responsabilités** : routes / contrôleurs / modèles
- **Validation des entrées** via `express-validator`
- **Codes HTTP sémantiques** sur toutes les réponses
- **Gestion des erreurs** centralisée
- **Documentation** automatique avec Swagger/OpenAPI 3.0

---

## Déploiement (optionnel)

### Railway

```bash
# Installer Railway CLI
npm install -g @railway/cli
railway login
railway init
railway up
```

### Render

Connecter le dépôt GitHub à [render.com](https://render.com), choisir "Web Service" et définir :
- **Build command** : `npm install`
- **Start command** : `npm start`
