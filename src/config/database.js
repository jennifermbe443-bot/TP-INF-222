// src/config/database.js
const Database = require('better-sqlite3');
const path     = require('path');

const DB_PATH = path.join(__dirname, '../../db.sqlite');

const db = new Database(DB_PATH);

// Optimisations SQLite
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

/**
 * Initialise les tables au démarrage du serveur
 */
function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      titre       TEXT    NOT NULL,
      contenu     TEXT    NOT NULL,
      auteur      TEXT    NOT NULL,
      date        TEXT    NOT NULL DEFAULT (date('now')),
      categorie   TEXT    NOT NULL DEFAULT 'Non classé',
      tags        TEXT    NOT NULL DEFAULT '[]',
      created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);

  console.log('✅ Base de données SQLite initialisée.');
}

module.exports = { db, initDB };