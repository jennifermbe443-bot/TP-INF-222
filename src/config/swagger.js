// src/config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API - INF222 EC1 Taf1',
      version: '1.0.0',
      description:
        'API REST pour la gestion d\'un blog simple. Développée par MAFOGANG MBE JENNIE PRISCA (24G2630) dans le cadre du cours INF222.',
      contact: {
        name: 'MAFOGANG MBE JENNIE PRISCA',
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement local'
      }
    ],
    tags: [
      {
        name: 'Articles',
        description: 'Gestion des articles du blog'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
