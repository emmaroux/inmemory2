const fs = require('fs');
const path = require('path');

const contentTypes = ['category', 'memory', 'vote', 'comment'];

contentTypes.forEach(type => {
  const basePath = path.join(__dirname, '..', 'src', 'api', type);

  // Créer les dossiers nécessaires
  const dirs = [
    path.join(basePath, 'controllers'),
    path.join(basePath, 'services'),
    path.join(basePath, 'routes')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Créer le contrôleur
  const controllerContent = `'use strict';

/**
 * ${type} controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::${type}.${type}');
`;

  // Créer le service
  const serviceContent = `'use strict';

/**
 * ${type} service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::${type}.${type}');
`;

  // Créer le fichier routes.js
  const routesContent = `'use strict';

/**
 * ${type} router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::${type}.${type}');
`;

  // Écrire les fichiers
  fs.writeFileSync(path.join(basePath, 'controllers', `${type}.js`), controllerContent);
  fs.writeFileSync(path.join(basePath, 'services', `${type}.js`), serviceContent);
  fs.writeFileSync(path.join(basePath, 'routes', `${type}.js`), routesContent);

  console.log(`Fichiers API générés pour ${type}`);
});

console.log('Génération des fichiers API terminée !'); 