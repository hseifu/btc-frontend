import { disconnectGuessSocket, getGuessSocket } from '@/config/socket'
import { apiClient } from '@/lib/axios'
import { AxiosError } from 'axios'
import { create } from 'zustand'
import { useScoresStore } from './scoresStore'

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
  isConnected: boolean
  error: string | null
  createGuess: (direction: GuessDirection) => Promise<Guess>
  fetchMyGuesses: () => Promise<void>
  fetchAllGuesses: () => Promise<void>
  connectWebSocket: () => void
  disconnectWebSocket: () => void
  subscribeToGuess: (guessId: string) => void
  subscribeToPendingGuesses: () => void
  clearError: () => void
}

export const useGuessesStore = create<GuessesState>((set, get) => ({
  guesses: [],
  myGuesses: [],
  isLoading: false,
  isConnected: false,
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

      // Subscribe to the newly created guess for real-time updates
      if (response.data.status === GuessStatus.PENDING) {
        get().subscribeToGuess(response.data.id)
      }

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

      // Subscribe to pending guesses after fetching
      get().subscribeToPendingGuesses()
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

  connectWebSocket: () => {
    const socket = getGuessSocket()

    // Don't reconnect if already connected
    if (socket.connected) {
      return
    }

    // Set up event listeners
    socket.on('connect', () => {
      console.log('Connected to Guess notifications WebSocket')
      set({ isConnected: true })
      get().subscribeToPendingGuesses()
    })

    socket.on('guessValidated', (validatedGuess: Guess) => {
      console.log('Received guess validation:', validatedGuess)

      set((state) => ({
        myGuesses: state.myGuesses.map((guess) =>
          guess.id === validatedGuess.id ? validatedGuess : guess,
        ),
      }))

      set((state) => ({
        guesses: state.guesses.map((guess) =>
          guess.id === validatedGuess.id ? validatedGuess : guess,
        ),
      }))

      // Refetch the user's score after guess validation in order to update the shown score in the dashboard
      const { fetchMyScore, fetchLeaderboard } = useScoresStore.getState()
      if (validatedGuess.userId) {
        fetchMyScore(validatedGuess.userId)
      }
      fetchLeaderboard()
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from Guess notifications WebSocket')
      set({ isConnected: false })
    })

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
      set({
        error: 'Failed to connect to guess notifications',
        isConnected: false,
      })
    })

    socket.connect()
  },

  disconnectWebSocket: () => {
    disconnectGuessSocket()
    set({ isConnected: false })
  },

  subscribeToGuess: (guessId: string) => {
    const socket = getGuessSocket()
    if (socket.connected) {
      socket.emit('subscribeToGuess', guessId)
      console.log(`Subscribed to guess ${guessId}`)
    }
  },

  subscribeToPendingGuesses: () => {
    const { myGuesses } = get()
    const pendingGuesses = myGuesses.filter(
      (guess) => guess.status === GuessStatus.PENDING,
    )

    pendingGuesses.forEach((guess) => {
      get().subscribeToGuess(guess.id)
    })

    if (pendingGuesses.length > 0) {
      console.log(`Subscribed to ${pendingGuesses.length} pending guess(es)`)
    }
  },

  clearError: () => {
    set({ error: null })
  },
}))
