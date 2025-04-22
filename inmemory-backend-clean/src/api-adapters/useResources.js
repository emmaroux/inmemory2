import { useState, useEffect, useCallback } from 'react';
import ApiService from './ApiService';

/**
 * Hook React pour récupérer les ressources avec leurs relations
 * @param {Object} options - Options de pagination et de filtrage
 * @returns {Object} Données et fonctions pour manipuler les ressources
 */
export function useResources(options = {}) {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: options.page || 1,
    pageSize: options.pageSize || 10,
    total: 0,
    pageCount: 0,
  });

  // Fonction pour charger les ressources
  const loadResources = useCallback(async (params = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fusionner les options par défaut avec les paramètres fournis
      const queryParams = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...options,
        ...params,
      };
      
      // Récupérer les ressources avec leurs relations
      const data = await ApiService.getResourcesWithRelations(queryParams);
      
      // Mettre à jour l'état
      setResources(data);
      
      // Récupérer les informations de pagination depuis l'API
      const response = await fetch(`http://localhost:1337/api/resources?pagination[page]=${queryParams.page}&pagination[pageSize]=${queryParams.pageSize}`);
      const result = await response.json();
      
      // Mettre à jour la pagination
      if (result.meta?.pagination) {
        setPagination({
          page: result.meta.pagination.page,
          pageSize: result.meta.pagination.pageSize,
          total: result.meta.pagination.total,
          pageCount: result.meta.pagination.pageCount,
        });
      }
    } catch (err) {
      console.error('Erreur lors du chargement des ressources:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement des ressources');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.pageSize, options]);

  // Fonction pour changer de page
  const changePage = useCallback((newPage) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  }, []);

  // Fonction pour changer la taille de la page
  const changePageSize = useCallback((newPageSize) => {
    setPagination((prev) => ({
      ...prev,
      page: 1, // Retour à la première page lors du changement de taille
      pageSize: newPageSize,
    }));
  }, []);

  // Fonction pour créer un vote
  const createVote = useCallback(async (voteData) => {
    try {
      const newVote = await ApiService.createVote(voteData);
      
      // Rafraîchir les données
      loadResources();
      
      return newVote;
    } catch (err) {
      console.error('Erreur lors de la création du vote:', err);
      throw err;
    }
  }, [loadResources]);

  // Fonction pour créer un commentaire
  const createComment = useCallback(async (commentData) => {
    try {
      const newComment = await ApiService.createComment(commentData);
      
      // Rafraîchir les données
      loadResources();
      
      return newComment;
    } catch (err) {
      console.error('Erreur lors de la création du commentaire:', err);
      throw err;
    }
  }, [loadResources]);

  // Charger les ressources au montage et lorsque les dépendances changent
  useEffect(() => {
    loadResources();
  }, [loadResources]);

  return {
    resources,
    isLoading,
    error,
    pagination,
    refresh: loadResources,
    changePage,
    changePageSize,
    createVote,
    createComment,
  };
}

export default useResources; 