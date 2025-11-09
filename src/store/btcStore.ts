import { API_ENDPOINTS } from '@/config/api'
import { create } from 'zustand'

export interface BtcPriceData {
  price: number
  priceChangeLast24h: number
  timestamp: Date
}

interface BtcState {
  btcPriceData: BtcPriceData | null
  isLoading: boolean
  error: string | null
  fetchBtcPriceData: () => Promise<void>
  clearError: () => void
}

export const useBtcStore = create<BtcState>((set) => ({
  btcPriceData: null,
  isLoading: false,
  error: null,

  fetchBtcPriceData: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(API_ENDPOINTS.BTC.PRICE, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch BTC price')
      }

      const data = await response.json()

      set({
        btcPriceData: data,
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
