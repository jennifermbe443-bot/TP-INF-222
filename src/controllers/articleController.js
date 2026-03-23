// src/controllers/article_controller.js
const Article = require('../models/articleModel');

/**
 * GET /api/articles
 * Récupère tous les articles, filtrables par ?categorie=, ?auteur=, ?date=
 */
const getAllArticles = (req, res) => {
  try {
    const { categorie, auteur, date } = req.query;
    const articles = Article.findAll({ categorie, auteur, date });
    return res.status(200).json({ articles });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur lors de la récupération des articles.' });
  }
};

/**
 * GET /api/articles/search?query=texte
 * Recherche dans le titre et le contenu
 */
const searchArticles = (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Le paramètre "query" est requis pour la recherche.' });
    }

    const articles = Article.search(query.trim());
    return res.status(200).json({ articles });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur lors de la recherche.' });
  }
};

/**
 * GET /api/articles/:id
 * Récupère un article par son ID
 */
const getArticleById = (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'L\'ID fourni n\'est pas valide.' });
    }

    const article = Article.findById(id);

    if (!article) {
      return res.status(404).json({ error: `Article avec l'ID ${id} introuvable.` });
    }

    return res.status(200).json({ article });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur lors de la récupération de l\'article.' });
  }
};

/**
 * POST /api/articles
 * Crée un nouvel article
 * Body attendu : { titre, contenu, auteur, date?, categorie?, tags? }
 */
const createArticle = (req, res) => {
  try {
    const { titre, contenu, auteur, date, categorie, tags } = req.body;

    // --- Validation des champs obligatoires ---
    const errors = [];
    if (!titre   || titre.trim()   === '') errors.push('Le champ "titre" est obligatoire.');
    if (!contenu || contenu.trim() === '') errors.push('Le champ "contenu" est obligatoire.');
    if (!auteur  || auteur.trim()  === '') errors.push('Le champ "auteur" est obligatoire.');

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Validation du format de date si fournie
    if (date && isNaN(Date.parse(date))) {
      return res.status(400).json({ error: 'Le format de la date est invalide. Utilisez YYYY-MM-DD.' });
    }

    // Validation des tags
    if (tags !== undefined && !Array.isArray(tags)) {
      return res.status(400).json({ error: 'Les "tags" doivent être un tableau (ex: ["js", "node"]).' });
    }

    const article = Article.create({ titre, contenu, auteur, date, categorie, tags });
    return res.status(201).json({
      message: 'Article créé avec succès.',
      article
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur lors de la création de l\'article.' });
  }
};

/**
 * PUT /api/articles/:id
 * Met à jour un article existant
 * Body attendu : { titre?, contenu?, categorie?, tags? }
 */
const updateArticle = (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'L\'ID fourni n\'est pas valide.' });
    }

    const { titre, contenu, categorie, tags } = req.body;

    // Vérifier qu'au moins un champ est fourni
    if (titre === undefined && contenu === undefined && categorie === undefined && tags === undefined) {
      return res.status(400).json({ error: 'Aucun champ à mettre à jour n\'a été fourni.' });
    }

    // Validation : les champs ne doivent pas être des chaînes vides
    if (titre   !== undefined && titre.trim()   === '') return res.status(400).json({ error: 'Le titre ne peut pas être vide.' });
    if (contenu !== undefined && contenu.trim() === '') return res.status(400).json({ error: 'Le contenu ne peut pas être vide.' });
    if (tags    !== undefined && !Array.isArray(tags))  return res.status(400).json({ error: 'Les tags doivent être un tableau.' });

    const article = Article.update(id, { titre, contenu, categorie, tags });

    if (!article) {
      return res.status(404).json({ error: `Article avec l'ID ${id} introuvable.` });
    }

    return res.status(200).json({
      message: 'Article mis à jour avec succès.',
      article
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de l\'article.' });
  }
};

/**
 * DELETE /api/articles/:id
 * Supprime un article par son ID
 */
const deleteArticle = (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'L\'ID fourni n\'est pas valide.' });
    }

    const deleted = Article.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: `Article avec l'ID ${id} introuvable.` });
    }

    return res.status(200).json({ message: `Article ${id} supprimé avec succès.` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur lors de la suppression de l\'article.' });
  }
};

module.exports = {
  getAllArticles,
  searchArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
};