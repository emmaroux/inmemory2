import { apiClient } from '../client';
import { 
  Resource, 
  StrapiResponse, 
  PaginationParams,
  FilterParams,
  ApiParams
} from '@inmemory/types';

// Construction des paramètres de requête pour Strapi
const buildQueryParams = (params?: ApiParams) => {
  let queryParams: Record<string, any> = {};

  if (params?.pagination) {
    queryParams['pagination[page]'] = params.pagination.page || 1;
    queryParams['pagination[pageSize]'] = params.pagination.pageSize || 25;
  }

  if (params?.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([op, val]) => {
          queryParams[`filters[${key}][${op}]`] = val;
        });
      } else {
        queryParams[`filters[${key}]`] = value;
      }
    });
  }

  if (params?.sort) {
    queryParams['sort'] = `${params.sort.field}:${params.sort.order}`;
  }

  if (params?.populate) {
    if (typeof params.populate === 'string') {
      queryParams['populate'] = params.populate;
    } else if (Array.isArray(params.populate)) {
      params.populate.forEach((item, index) => {
        queryParams[`populate[${index}]`] = item;
      });
    } else {
      Object.entries(params.populate).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([subKey, subValue]) => {
            queryParams[`populate[${key}][${subKey}]`] = subValue;
          });
        } else {
          queryParams[`populate[${key}]`] = value;
        }
      });
    }
  }

  return queryParams;
};

export const ResourceService = {
  // Récupérer toutes les ressources avec pagination et filtres
  async getResources(params?: ApiParams): Promise<StrapiResponse<Resource>> {
    const queryParams = buildQueryParams(params);
    return apiClient.get<StrapiResponse<Resource>>('/api/resources', queryParams);
  },

  // Récupérer une ressource par son ID
  async getResource(id: number | string, params?: ApiParams): Promise<Resource> {
    const queryParams = buildQueryParams(params);
    const response = await apiClient.get<{ data: Resource }>(`/api/resources/${id}`, queryParams);
    return response.data;
  },

  // Créer une nouvelle ressource
  async createResource(data: Partial<Resource>): Promise<Resource> {
    const response = await apiClient.post<{ data: Resource }>('/api/resources', { data });
    return response.data;
  },

  // Mettre à jour une ressource
  async updateResource(id: number | string, data: Partial<Resource>): Promise<Resource> {
    const response = await apiClient.put<{ data: Resource }>(`/api/resources/${id}`, { data });
    return response.data;
  },

  // Supprimer une ressource
  async deleteResource(id: number | string): Promise<void> {
    await apiClient.delete(`/api/resources/${id}`);
  },

  // Voter pour une ressource
  async voteForResource(resourceId: number | string, teamId: number | string, value: number = 1): Promise<void> {
    await apiClient.post('/api/votes', {
      data: {
        resource: resourceId,
        team: teamId,
        value
      }
    });
  },

  // Ajouter un commentaire à une ressource
  async commentResource(resourceId: number | string, teamId: number | string, content: string): Promise<void> {
    await apiClient.post('/api/comments', {
      data: {
        resource: resourceId,
        team: teamId,
        content
      }
    });
  }
}; 