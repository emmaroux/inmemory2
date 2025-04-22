/**
 * Service d'API pour InMemory
 * 
 * Ce service fournit des méthodes pour interagir avec l'API Strapi personnalisée.
 * Il masque la complexité des requêtes multiples et de la structure de données inconsistante.
 */

// Configuration de base
const API_URL = 'http://localhost:1337';

// Système de cache simple
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes en millisecondes

/**
 * Classe principale du service d'API
 */
export class ApiService {
  /**
   * Récupère les ressources avec toutes leurs relations
   * @param {Object} options - Options de pagination et de filtrage
   * @returns {Promise<Array>} Liste des ressources avec leurs relations
   */
  static async getResourcesWithRelations(options = {}) {
    const { page = 1, pageSize = 10, filters = {} } = options;
    
    // Construction de l'URL avec pagination
    let url = `${API_URL}/api/resources?pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
    
    // Ajout des filtres si présents
    Object.entries(filters).forEach(([key, value]) => {
      url += `&filters[${key}][$eq]=${value}`;
    });
    
    // Utilisation du cache si disponible
    const cacheKey = `resources_${url}`;
    const cachedData = this.getFromCache(cacheKey);
    if (cachedData) return cachedData;
    
    // 1. Récupérer les ressources
    const resources = await this.getResources(options);
    
    // 2. Pour chaque ressource, récupérer les relations
    const enhancedResources = await Promise.all(
      resources.map(async resource => {
        const [category, votes, comments] = await Promise.all([
          this.getCategoryForResource(resource.id),
          this.getVotesForResource(resource.id),
          this.getCommentsForResource(resource.id),
        ]);
        
        // 3. Fusionner les données
        return {
          ...resource,
          category,
          votes,
          comments,
        };
      })
    );
    
    // Mettre en cache le résultat
    this.setInCache(cacheKey, enhancedResources);
    
    return enhancedResources;
  }
  
  /**
   * Récupère une seule ressource avec toutes ses relations
   * @param {number} id - ID de la ressource
   * @returns {Promise<Object>} La ressource avec ses relations
   */
  static async getResourceWithRelations(id) {
    // Utilisation du cache si disponible
    const cacheKey = `resource_${id}`;
    const cachedData = this.getFromCache(cacheKey);
    if (cachedData) return cachedData;
    
    // 1. Récupérer la ressource
    const resource = await this.getResource(id);
    
    if (!resource) return null;
    
    // 2. Récupérer les relations
    const [category, votes, comments] = await Promise.all([
      this.getCategoryForResource(id),
      this.getVotesForResource(id),
      this.getCommentsForResource(id),
    ]);
    
    // 3. Fusionner les données
    const enhancedResource = {
      ...resource,
      category,
      votes,
      comments,
    };
    
    // Mettre en cache le résultat
    this.setInCache(cacheKey, enhancedResource);
    
    return enhancedResource;
  }
  
  /**
   * Récupère toutes les ressources
   * @param {Object} options - Options de pagination et de filtrage
   * @returns {Promise<Array>} Liste des ressources
   */
  static async getResources(options = {}) {
    const { page = 1, pageSize = 10, filters = {} } = options;
    
    // Construction de l'URL avec pagination
    let url = `${API_URL}/api/resources?pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
    
    // Ajout des filtres si présents
    Object.entries(filters).forEach(([key, value]) => {
      url += `&filters[${key}][$eq]=${value}`;
    });
    
    // Effectuer la requête
    const response = await fetch(url);
    const data = await response.json();
    
    return data.data || [];
  }
  
  /**
   * Récupère une seule ressource par son ID
   * @param {number} id - ID de la ressource
   * @returns {Promise<Object>} La ressource
   */
  static async getResource(id) {
    const response = await fetch(`${API_URL}/api/resources/${id}`);
    const data = await response.json();
    
    return data.data || null;
  }
  
  /**
   * Récupère la catégorie associée à une ressource
   * @param {number} resourceId - ID de la ressource
   * @returns {Promise<Object>} La catégorie associée
   */
  static async getCategoryForResource(resourceId) {
    const response = await fetch(`${API_URL}/api/categories?filters[resources][id][$eq]=${resourceId}`);
    const data = await response.json();
    
    return data.data?.results?.[0] || null;
  }
  
  /**
   * Récupère les votes associés à une ressource
   * @param {number} resourceId - ID de la ressource
   * @returns {Promise<Array>} Liste des votes
   */
  static async getVotesForResource(resourceId) {
    const response = await fetch(`${API_URL}/api/votes?filters[resource][id][$eq]=${resourceId}`);
    const data = await response.json();
    
    return data.data || [];
  }
  
  /**
   * Récupère les commentaires associés à une ressource
   * @param {number} resourceId - ID de la ressource
   * @returns {Promise<Array>} Liste des commentaires
   */
  static async getCommentsForResource(resourceId) {
    const response = await fetch(`${API_URL}/api/comments?filters[resource][id][$eq]=${resourceId}`);
    const data = await response.json();
    
    return data.data || [];
  }
  
  /**
   * Récupère les équipes
   * @returns {Promise<Array>} Liste des équipes
   */
  static async getTeams() {
    const response = await fetch(`${API_URL}/api/teams`);
    const data = await response.json();
    
    return data.data || [];
  }
  
  /**
   * Crée un nouveau vote
   * @param {Object} voteData - Données du vote
   * @returns {Promise<Object>} Le vote créé
   */
  static async createVote(voteData) {
    // Invalider le cache pour les ressources concernées
    this.invalidateCache(`resource_${voteData.resource}`);
    this.invalidateCache(/^resources_/);
    
    const response = await fetch(`${API_URL}/api/votes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: voteData }),
    });
    
    const data = await response.json();
    return data.data;
  }
  
  /**
   * Crée un nouveau commentaire
   * @param {Object} commentData - Données du commentaire
   * @returns {Promise<Object>} Le commentaire créé
   */
  static async createComment(commentData) {
    // Invalider le cache pour les ressources concernées
    this.invalidateCache(`resource_${commentData.resource}`);
    this.invalidateCache(/^resources_/);
    
    const response = await fetch(`${API_URL}/api/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: commentData }),
    });
    
    const data = await response.json();
    return data.data;
  }
  
  // Méthodes de gestion du cache
  
  /**
   * Récupère une donnée du cache
   * @param {string} key - Clé de cache
   * @returns {any} Donnée mise en cache ou null
   */
  static getFromCache(key) {
    if (!cache.has(key)) return null;
    
    const { data, timestamp } = cache.get(key);
    const isExpired = Date.now() - timestamp > CACHE_DURATION;
    
    if (isExpired) {
      cache.delete(key);
      return null;
    }
    
    return data;
  }
  
  /**
   * Met une donnée en cache
   * @param {string} key - Clé de cache
   * @param {any} data - Donnée à mettre en cache
   */
  static setInCache(key, data) {
    cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }
  
  /**
   * Invalide une entrée de cache
   * @param {string|RegExp} keyPattern - Clé ou motif de clé à invalider
   */
  static invalidateCache(keyPattern) {
    if (keyPattern instanceof RegExp) {
      // Supprimer toutes les clés qui correspondent au motif
      for (const key of cache.keys()) {
        if (keyPattern.test(key)) {
          cache.delete(key);
        }
      }
    } else {
      // Supprimer une clé spécifique
      cache.delete(keyPattern);
    }
  }
  
  /**
   * Vide entièrement le cache
   */
  static clearCache() {
    cache.clear();
  }
}

export default ApiService; 