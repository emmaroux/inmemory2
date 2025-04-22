import { useState, useEffect, useCallback } from 'react';
import ApiService from './ApiService';

/**
 * Hook React pour récupérer une seule ressource avec ses relations
 * @param {number} resourceId - ID de la ressource à récupérer
 * @returns {Object} Données et fonctions pour manipuler la ressource
 */
export function useResource(resourceId) {
  const [resource, setResource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour charger la ressource
  const loadResource = useCallback(async () => {
    if (!resourceId) {
      setResource(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Récupérer la ressource avec ses relations
      const data = await ApiService.getResourceWithRelations(resourceId);
      
      // Mettre à jour l'état
      setResource(data);
    } catch (err) {
      console.error(`Erreur lors du chargement de la ressource ${resourceId}:`, err);
      setError(err.message || `Une erreur est survenue lors du chargement de la ressource ${resourceId}`);
    } finally {
      setIsLoading(false);
    }
  }, [resourceId]);

  // Fonction pour créer un vote
  const createVote = useCallback(async (voteData) => {
    try {
      const newVote = await ApiService.createVote({
        ...voteData,
        resource: resourceId,
      });
      
      // Rafraîchir les données
      loadResource();
      
      return newVote;
    } catch (err) {
      console.error('Erreur lors de la création du vote:', err);
      throw err;
    }
  }, [resourceId, loadResource]);

  // Fonction pour créer un commentaire
  const createComment = useCallback(async (commentData) => {
    try {
      const newComment = await ApiService.createComment({
        ...commentData,
        resource: resourceId,
      });
      
      // Rafraîchir les données
      loadResource();
      
      return newComment;
    } catch (err) {
      console.error('Erreur lors de la création du commentaire:', err);
      throw err;
    }
  }, [resourceId, loadResource]);

  // Charger la ressource au montage et lorsque l'ID change
  useEffect(() => {
    loadResource();
  }, [loadResource]);

  return {
    resource,
    isLoading,
    error,
    refresh: loadResource,
    createVote,
    createComment,
  };
}

export default useResource; 