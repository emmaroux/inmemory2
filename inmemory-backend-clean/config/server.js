const seed = require('../scripts/seed');

module.exports = ({ env }) => {
  console.log('\n\n\n');
  console.log('#############################################');
  console.log('### CHARGEMENT DU SERVER.JS ###');
  console.log('#############################################');
  console.log('\n');
  
  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    app: {
      keys: env.array('APP_KEYS'),
    },
    webhooks: {
      populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
    },
    config: {
      bootstrap: async (strapi) => {
        console.log('\n\n\n');
        console.log('#############################################');
        console.log('### TOTOTOTOTOTTO - DÉBUT DU BOOTSTRAP - TOTOTOTOTOTTO ###');
        console.log('#############################################');
        console.log('\n');

        try {
          // Attendre que Strapi soit complètement initialisé
          console.log('=== Attente de l\'initialisation complète de Strapi ===');
          await new Promise(resolve => setTimeout(resolve, 5000));

          // Exécution du script de seeding
          console.log('\n=== Début du seeding ===');
          await seed(strapi);
          console.log('=== Fin du seeding ===\n');
        } catch (error) {
          console.error('\n');
          console.error('#############################################');
          console.error('### TOTOTOTOTOTTO - ERREUR SEEDING - TOTOTOTOTOTTO ###');
          console.error('#############################################');
          console.error('Message:', error.message);
          console.error('Stack:', error.stack);
          console.error('#############################################');
          console.error('\n\n\n');
          throw error;
        }

        console.log('\n');
        console.log('#############################################');
        console.log('### TOTOTOTOTOTTO - FIN DU BOOTSTRAP - TOTOTOTOTOTTO ###');
        console.log('#############################################');
        console.log('\n\n\n');
      }
    }
  };
};
