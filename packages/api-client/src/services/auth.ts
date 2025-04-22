import { apiClient } from '../client';
import { AuthResponse, LoginCredentials, RegisterData, User } from '@inmemory/types';

export const AuthService = {
  // Connexion utilisateur
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/local', credentials);
    
    // Stocker le token JWT dans le localStorage
    if (typeof window !== 'undefined' && response.jwt) {
      localStorage.setItem('token', response.jwt);
    }
    
    return response;
  },

  // Inscription utilisateur
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/local/register', data);
    
    // Stocker le token JWT dans le localStorage
    if (typeof window !== 'undefined' && response.jwt) {
      localStorage.setItem('token', response.jwt);
    }
    
    return response;
  },

  // Déconnexion utilisateur
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    
    return !!localStorage.getItem('token');
  },

  // Récupérer l'utilisateur courant
  async getCurrentUser(): Promise<User | null> {
    if (!this.isAuthenticated()) {
      return null;
    }
    
    try {
      const response = await apiClient.get<{ data: User }>('/api/users/me');
      return response.data;
    } catch (error) {
      this.logout();
      return null;
    }
  }
}; 