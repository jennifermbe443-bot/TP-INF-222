// app.js
const express    = require('express');
const { initDB } = require('./config/database');

// ─── Swagger ───────────────────────────────────────────────────────────────
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi    = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title:       'API Blog - INF222',
      version:     '1.0.0',
      description: 'API REST de gestion d\'articles pour un blog simple',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./app.js'], // Les annotations JSDoc sont dans ce fichier
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// ─── App ───────────────────────────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialiser la base de données
initDB();

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Contrôleur ───────────────────────────────────────────────────────────
const {
  getAllArticles,
  searchArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
} = require('./controllers/articleController');

// ─── Routes ───────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/articles/search:
 *   get:
 *     summary: Rechercher des articles par titre ou contenu
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Texte à rechercher dans le titre ou le contenu
 *     responses:
 *       200:
 *         description: Liste des articles correspondants
 *       400:
 *         description: Paramètre query manquant
 */
app.get('/api/articles/search', searchArticles);

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Récupérer tous les articles (avec filtres optionnels)
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: categorie
 *         schema:
 *           type: string
 *         description: Filtrer par catégorie
 *       - in: query
 *         name: auteur
 *         schema:
 *           type: string
 *         description: Filtrer par auteur
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrer par date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Liste des articles
 */
app.get('/api/articles', getAllArticles);

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Récupérer un article par son ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: L'article correspondant
 *       404:
 *         description: Article introuvable
 */
app.get('/api/articles/:id', getArticleById);

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Créer un nouvel article
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titre, contenu, auteur]
 *             properties:
 *               titre:
 *                 type: string
 *                 example: "Introduction à Node.js"
 *               contenu:
 *                 type: string
 *                 example: "Node.js est un runtime JavaScript côté serveur..."
 *               auteur:
 *                 type: string
 *                 example: "Charles"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-03-23"
 *               categorie:
 *                 type: string
 *                 example: "Technologie"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["nodejs", "backend"]
 *     responses:
 *       201:
 *         description: Article créé avec succès
 *       400:
 *         description: Données invalides
 */
app.post('/api/articles', createArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     summary: Mettre à jour un article existant
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               contenu:
 *                 type: string
 *               categorie:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Article mis à jour
 *       404:
 *         description: Article introuvable
 */
app.put('/api/articles/:id', updateArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Supprimer un article par son ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Article supprimé
 *       404:
 *         description: Article introuvable
 */
app.delete('/api/articles/:id', deleteArticle);

// ─── Route de base ────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message:       'API Blog INF222 — opérationnelle ✅',
    documentation: 'http://localhost:3000/api-docs'
  });
});

// ─── Gestion des routes inexistantes ──────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} introuvable.` });
});

// ─── Démarrage du serveur ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📚 Documentation Swagger : http://localhost:${PORT}/api-docs`);
});

module.exports = app;