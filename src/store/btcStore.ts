import { disconnectBtcSocket, getBtcSocket } from '@/config/socket'
import { apiClient } from '@/lib/axios'
import { create } from 'zustand'

export interface BtcPriceData {
  price: number
  priceChangeLast24h: number
  timestamp: Date
}

interface BtcState {
  btcPriceData: BtcPriceData | null
  isLoading: boolean
  isConnected: boolean
  error: string | null
  connectWebSocket: () => void
  disconnectWebSocket: () => void
  fetchBtcPriceData: () => Promise<void>
  clearError: () => void
}

export const useBtcStore = create<BtcState>((set) => ({
  btcPriceData: null,
  isLoading: false,
  isConnected: false,
  error: null,

  connectWebSocket: () => {
    const socket = getBtcSocket()

    // Don't reconnect if already connected
    if (socket.connected) {
      return
    }

    set({ isLoading: true, error: null })

    // Set up event listeners
    socket.on('connect', () => {
      console.log('Connected to BTC price WebSocket')
      set({ isConnected: true, isLoading: false, error: null })
    })

    socket.on('btcPrice', (data: BtcPriceData) => {
      set({
        btcPriceData: {
          ...data,
          timestamp: new Date(data.timestamp),
        },
        isLoading: false,
        error: null,
      })
    })

    socket.on('btcPriceError', (error: { message: string; error: string }) => {
      console.error('BTC price error:', error)
      set({
        error: error.message || 'Failed to fetch BTC price',
        isLoading: false,
      })
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from BTC price WebSocket')
      set({ isConnected: false })
    })

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
      set({
        error: 'Failed to connect to BTC price stream',
        isLoading: false,
        isConnected: false,
      })
    })

    // Connect the socket
    socket.connect()
  },

  disconnectWebSocket: () => {
    disconnectBtcSocket()
    set({ isConnected: false })
  },

  // Fallback method for fetching BTC price via REST API
  fetchBtcPriceData: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.get<BtcPriceData>(
        '/v1/btc-tracker/price',
      )

      set({
        btcPriceData: response.data,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to fetch BTC price',
        isLoading: false,
      })
    }
  },

  clearError: () => {
    set({ error: null })
  },
}))
