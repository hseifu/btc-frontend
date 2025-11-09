import { apiClient } from '@/lib/axios'
import { AxiosError } from 'axios'
import { create } from 'zustand'

export enum GuessDirection {
  UP = 'UP',
  DOWN = 'DOWN',
}

export enum GuessStatus {
  PENDING = 'PENDING',
  WON = 'WON',
  LOST = 'LOST',
}

export interface Guess {
  id: string
  userId: string
  direction: GuessDirection
  status: GuessStatus
  initialPrice: number
  finalPrice: number | null
  createdAt: string
  updatedAt: string
  validatedAt: string | null
  user?: {
    id: string
    email: string
    name: string
  }
}

interface GuessesState {
  guesses: Guess[]
  myGuesses: Guess[]
  isLoading: boolean
  error: string | null
  createGuess: (direction: GuessDirection) => Promise<Guess>
  fetchMyGuesses: () => Promise<void>
  fetchAllGuesses: () => Promise<void>
  clearError: () => void
}

export const useGuessesStore = create<GuessesState>((set) => ({
  guesses: [],
  myGuesses: [],
  isLoading: false,
  error: null,

  createGuess: async (direction: GuessDirection) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.post<Guess>('/v1/guesses', {
        direction,
      })

      set((state) => ({
        // Optimistically update the myGuesses array
        myGuesses: [response.data, ...state.myGuesses],
        isLoading: false,
        error: null,
      }))

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to create guess'

      set({
        error: errorMessage,
        isLoading: false,
      })
      throw error
    }
  },

  fetchMyGuesses: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.get<Guess[]>('/v1/guesses/me')

      set({
        myGuesses: response.data,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to fetch guesses'

      set({
        error: errorMessage,
        isLoading: false,
      })
    }
  },

  fetchAllGuesses: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.get<Guess[]>('/v1/guesses')

      set({
        guesses: response.data,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to fetch guesses'

      set({
        error: errorMessage,
        isLoading: false,
      })
    }
  },

  clearError: () => {
    set({ error: null })
  },
}))
