// Exporter les classes et interfaces principales
export { ApiClient, apiClient } from './client';
export { ApiConfig, defaultConfig, getAuthHeaders } from './config';

// Exporter tous les services
export * from './services';

// Créer un objet API global qui regroupe tous les services
import { ResourceService, AuthService } from './services';

export const API = {
  resources: ResourceService,
  auth: AuthService,
}; 