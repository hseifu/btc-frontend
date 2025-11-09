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
} as const
