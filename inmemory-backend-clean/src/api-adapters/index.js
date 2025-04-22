/**
 * API Adapters pour InMemory
 * 
 * Ce module fournit des outils pour interagir avec l'API Strapi personnalisée.
 * Il masque la complexité des requêtes multiples et de la structure de données inconsistante.
 */

// Service principal d'API
export { default as ApiService } from './ApiService';

// Hooks React pour l'intégration facile
export { default as useResources } from './useResources';
export { default as useResource } from './useResource';

// Export par défaut pour faciliter l'import
export default {
  ApiService: require('./ApiService').default,
  useResources: require('./useResources').default,
  useResource: require('./useResource').default,
}; 