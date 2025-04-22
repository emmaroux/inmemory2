const path = require('path');
const seed = require('../scripts/seed');

module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'inmemory'),
      user: env('DATABASE_USERNAME', 'postgres'),
      password: env('DATABASE_PASSWORD', 'postgres'),
      schema: env('DATABASE_SCHEMA', 'public'),
      ssl: env.bool('DATABASE_SSL', false),
    },
    pool: {
      min: env.int('DATABASE_POOL_MIN', 2),
      max: env.int('DATABASE_POOL_MAX', 10),
    },
  },
  bootstrap: async (strapi) => {
    console.log('\n\n\n');
    console.log('#############################################');
    console.log('### DÉBUT DU BOOTSTRAP DE LA BASE DE DONNÉES ###');
    console.log('#############################################');
    console.log('\n');
    
    try {
      console.log('=== Vérification de l\'instance Strapi ===');
      console.log('Strapi est-il défini ?', !!strapi);
      console.log('Type de Strapi:', typeof strapi);

      // Attendre que Strapi soit complètement initialisé
      console.log('\n=== Attente de l\'initialisation complète de Strapi ===');
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Exécution du script de seeding
      console.log('\n\n\n');
      console.log('#############################################');
      console.log('### TOTOTOTOTOTTO - DÉBUT DU SEEDING - TOTOTOTOTOTTO ###');
      console.log('#############################################');
      console.log('\n');
      
      await seed(strapi);
      
      console.log('\n');
      console.log('#############################################');
      console.log('### TOTOTOTOTOTTO - FIN DU SEEDING - TOTOTOTOTOTTO ###');
      console.log('#############################################');
      console.log('\n\n\n');
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
    console.log('### FIN DU BOOTSTRAP DE LA BASE DE DONNÉES ###');
    console.log('#############################################');
    console.log('\n\n\n');
  },
});
