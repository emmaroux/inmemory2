import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiConfig, defaultConfig, getAuthHeaders } from './config';
import { StrapiError } from '@inmemory/types';

export class ApiClient {
  private axiosInstance: AxiosInstance;
  private config: ApiConfig;

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.axiosInstance = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: this.config.headers,
    });

    // Intercepteur pour ajouter les headers d'authentification
    this.axiosInstance.interceptors.request.use((config) => {
      const authHeaders = getAuthHeaders();
      config.headers = {
        ...config.headers,
        ...authHeaders,
      };
      return config;
    });
  }

  // Méthode générique pour faire un appel API
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.request(config);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const errorData: StrapiError = error.response.data.error || {
          status: error.response.status,
          name: 'ApiError',
          message: 'Une erreur est survenue lors de la requête API'
        };
        throw errorData;
      }
      throw {
        status: 500,
        name: 'NetworkError',
        message: error.message || 'Une erreur réseau est survenue'
      };
    }
  }

  // Méthodes de commodité pour les opérations CRUD
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>({
      method: 'GET',
      url,
      params,
    });
  }

  async post<T>(url: string, data?: any, params?: Record<string, any>): Promise<T> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
      params,
    });
  }

  async put<T>(url: string, data?: any, params?: Record<string, any>): Promise<T> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
      params,
    });
  }

  async delete<T>(url: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>({
      method: 'DELETE',
      url,
      params,
    });
  }
}

// Instance par défaut du client API
export const apiClient = new ApiClient(); 