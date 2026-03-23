// src/models/article_model.js
const { db } = require('../config/database');

const Article = {

  /**
   * Récupère tous les articles, avec filtres optionnels
   * @param {Object} filters - { categorie, auteur, date }
   */
  findAll(filters = {}) {
    let query = 'SELECT * FROM articles WHERE 1=1';
    const params = [];

    if (filters.categorie) {
      query += ' AND categorie = ?';
      params.push(filters.categorie);
    }
    if (filters.auteur) {
      query += ' AND auteur = ?';
      params.push(filters.auteur);
    }
    if (filters.date) {
      query += ' AND date = ?';
      params.push(filters.date);
    }

    query += ' ORDER BY created_at DESC';

    const articles = db.prepare(query).all(...params);
    // Désérialiser les tags (stockés en JSON string)
    return articles.map(a => ({ ...a, tags: JSON.parse(a.tags) }));
  },

  /**
   * Récupère un article par son ID
   * @param {number} id
   */
  findById(id) {
    const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
    if (!article) return null;
    return { ...article, tags: JSON.parse(article.tags) };
  },

  /**
   * Recherche des articles dont le titre ou le contenu contient le texte
   * @param {string} query
   */
  search(query) {
    const terme = `%${query}%`;
    const articles = db
      .prepare('SELECT * FROM articles WHERE titre LIKE ? OR contenu LIKE ? ORDER BY created_at DESC')
      .all(terme, terme);
    return articles.map(a => ({ ...a, tags: JSON.parse(a.tags) }));
  },

  /**
   * Crée un nouvel article
   * @param {Object} data - { titre, contenu, auteur, date, categorie, tags }
   */
  create({ titre, contenu, auteur, date, categorie, tags }) {
    const tagsJson = JSON.stringify(tags || []);
    const dateVal  = date || new Date().toISOString().split('T')[0];

    const stmt = db.prepare(`
      INSERT INTO articles (titre, contenu, auteur, date, categorie, tags)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(titre, contenu, auteur, dateVal, categorie || 'Non classé', tagsJson);
    return this.findById(result.lastInsertRowid);
  },

  /**
   * Met à jour un article existant
   * @param {number} id
   * @param {Object} data - champs à mettre à jour
   */
  update(id, { titre, contenu, categorie, tags }) {
    const existing = this.findById(id);
    if (!existing) return null;

    const newTitre     = titre     ?? existing.titre;
    const newContenu   = contenu   ?? existing.contenu;
    const newCategorie = categorie ?? existing.categorie;
    const newTags      = tags      !== undefined ? JSON.stringify(tags) : JSON.stringify(existing.tags);

    db.prepare(`
      UPDATE articles
      SET titre = ?, contenu = ?, categorie = ?, tags = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(newTitre, newContenu, newCategorie, newTags, id);

    return this.findById(id);
  },

  /**
   * Supprime un article par son ID
   * @param {number} id
   */
  delete(id) {
    const result = db.prepare('DELETE FROM articles WHERE id = ?').run(id);
    return result.changes > 0; // true si supprimé, false sinon
  }

};

module.exports = Article;