// API configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3009'

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/v1/auth/login`,
    REGISTER: `${API_BASE_URL}/v1/auth/register`,
    LOGOUT: `${API_BASE_URL}/v1/auth/logout`,
  },
  BTC: {
    PRICE: `${API_BASE_URL}/v1/btc-tracker/price`,
  },
  GUESSES: {
    BASE: `${API_BASE_URL}/v1/guesses`,
    ME: `${API_BASE_URL}/v1/guesses/me`,
    PENDING: `${API_BASE_URL}/v1/guesses/pending`,
    BY_ID: (id: string) => `${API_BASE_URL}/v1/guesses/${id}`,
    VALIDATE: (id: string) => `${API_BASE_URL}/v1/guesses/${id}/validate`,
  },
  SCORES: {
    BASE: `${API_BASE_URL}/v1/scores`,
    BY_USER_ID: (userId: string) => `${API_BASE_URL}/v1/scores/user/${userId}`,
  },
} as const
