'use strict';

const seed = require('../scripts/seed');

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    console.log('\n\n\n');
    console.log('#############################################');
    console.log('### CHARGEMENT DU BOOTSTRAP ###');
    console.log('#############################################');
    console.log('\n');
    
    // Vérifier si le seeding doit être exécuté (défini par variable d'environnement ou manuellement)
    const shouldSeed = process.env.SEED_DATA === 'true';
    
    if (shouldSeed) {
      try {
        console.log('=== Démarrage du seeding (SEED_DATA=true) ===');
        console.log('=== Vérification de l\'instance Strapi ===');
        console.log('Strapi est-il défini ?', !!strapi);
        console.log('Type de Strapi:', typeof strapi);

        // Attendre que Strapi soit complètement initialisé
        console.log('\n=== Attente de l\'initialisation complète de Strapi ===');
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Exécution du script de seeding
        console.log('\n=== Début du seeding ===');
        await seed(strapi);
        console.log('=== Fin du seeding ===\n');
      } catch (error) {
        console.error('\n');
        console.error('#############################################');
        console.error('### ERREUR SEEDING ###');
        console.error('#############################################');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        console.error('#############################################');
        console.error('\n\n\n');
      }
    } else {
      console.log('=== Seeding ignoré (SEED_DATA n\'est pas défini à true) ===');
      console.log('=== Pour exécuter le seeding, démarrez avec SEED_DATA=true npm run develop ===');
    }
    
    console.log('\n');
    console.log('#############################################');
    console.log('### FIN DU BOOTSTRAP ###');
    console.log('#############################################');
    console.log('\n\n\n');
  },
};
