// Types de base
export interface BaseEntity {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Modèles principaux
export interface Resource extends BaseEntity {
  title: string;
  description: string | null;
  imageUrl: string | null;
  link: string | null;
  category?: Category | null;
  votes?: Vote[];
  comments?: Comment[];
}

export interface Category extends BaseEntity {
  name: string;
  description: string;
}

export interface Team extends BaseEntity {
  name: string;
  color: string;
  users?: User[];
}

export interface User extends BaseEntity {
  username: string;
  email?: string;
}

export interface Vote extends BaseEntity {
  value: number;
  user: User;
  resource: Resource;
  team: Team;
}

export interface Comment extends BaseEntity {
  content: string;
  user?: User;
  resource: Resource;
  team?: Team;
}

// Types pour les réponses API Strapi
export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    }
  }
}

export interface StrapiError {
  status: number;
  name: string;
  message: string;
  details?: Record<string, any>;
}

// Types pour l'authentification
export interface AuthResponse {
  jwt: string;
  user: User;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// Types pour les paramètres de requête
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface FilterParams {
  [key: string]: any;
}

export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}

export interface ApiParams {
  pagination?: PaginationParams;
  filters?: FilterParams;
  sort?: SortParams;
  populate?: string | string[] | Record<string, any>;
} 