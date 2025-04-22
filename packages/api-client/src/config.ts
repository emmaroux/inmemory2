// Configuration de base pour l'API
export interface ApiConfig {
  baseUrl: string;
  headers?: Record<string, string>;
  timeout?: number;
}

// Configuration par défaut
export const defaultConfig: ApiConfig = {
  baseUrl: typeof window !== 'undefined' 
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'
    : 'http://localhost:1337',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
};

// Configuration de l'authentification
export const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === 'undefined') {
    return {};
  }

  const token = localStorage.getItem('token');
  
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
    };
  }
  
  return {};
}; 