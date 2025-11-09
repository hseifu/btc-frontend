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
