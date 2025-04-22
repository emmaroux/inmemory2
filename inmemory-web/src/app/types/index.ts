export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiEntity<T> {
  id: number;
  attributes: T;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Team {
  id: number;
  name: string;
  color: string;
  users?: User[];
  votes?: Vote[];
}

export interface Resource {
  id: number;
  documentId: string;
  title: string;
  imageUrl: string | null;
  link: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  votes?: Array<{
    id: number;
    documentId: string;
    value: number;
    createdAt: string;
    team?: {
      id: number;
      documentId: string;
      name: string;
      color: string;
    } | null;
    user?: {
      id: number;
      documentId: string;
      username: string;
    } | null;
  }>;
  category?: {
    id: number;
    documentId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  } | null;
  comments?: Array<{
    id: number;
    documentId: string;
    content: string;
    createdAt: string;
  }>;
}

export interface Vote {
  id: number;
  documentId: string;
  value: number;
  user: {
    id: number;
    documentId: string;
    username: string;
  };
  resource: {
    id: number;
    documentId: string;
    title: string;
  };
  team: {
    id: number;
    documentId: string;
    name: string;
    color: string;
  };
}

export interface Comment {
  id: number;
  documentId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  resource?: Resource;
  team?: {
    id: number;
    documentId: string;
    name: string;
  };
  user?: {
    id: number;
    documentId: string;
    username: string;
  };
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  resources?: Resource[];
}

export interface AuthResponse {
  jwt: string;
  user: User;
} 