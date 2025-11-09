import { apiClient } from '@/lib/axios'
import { AxiosError } from 'axios'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  name: string
}

interface AuthResponse {
  user: User
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiClient.post<AuthResponse>(
            '/v1/auth/login',
            { email, password },
          )

          set({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error) {
          const axiosError = error as AxiosError<{ message: string }>

          const errorMessage =
            axiosError.response?.data?.message ||
            axiosError.message ||
            'Login failed'

          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
          })
          throw error
        }
      },

      signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiClient.post<AuthResponse>(
            '/v1/auth/register',
            { name, email, password },
          )

          set({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error) {
          const axiosError = error as AxiosError<{ message: string }>
          const errorMessage =
            axiosError.response?.data?.message ||
            axiosError.message ||
            'Signup failed'

          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
          })
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
