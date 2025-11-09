import { apiClient } from '@/lib/axios'
import { AxiosError } from 'axios'
import { create } from 'zustand'

export interface Score {
  id: string
  userId: string
  points: number
  wins: number
  losses: number
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    email: string
    name: string | null
  }
}

interface ScoresState {
  scores: Score[]
  myScore: Score | null
  isLoading: boolean
  error: string | null
  fetchLeaderboard: () => Promise<void>
  fetchMyScore: (userId: string) => Promise<void>
  clearError: () => void
}

export const useScoresStore = create<ScoresState>((set) => ({
  scores: [],
  myScore: null,
  isLoading: false,
  error: null,

  fetchLeaderboard: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.get<Score[]>('/v1/scores')

      set({
        scores: response.data,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to fetch leaderboard'

      set({
        error: errorMessage,
        isLoading: false,
      })
    }
  },

  fetchMyScore: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.get<Score>(`/v1/scores/user/${userId}`)

      set({
        myScore: response.data,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>

      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to fetch score'

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
