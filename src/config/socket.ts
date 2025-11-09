import { io, Socket } from 'socket.io-client'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3009'

// BTC price socket instance
let btcSocket: Socket | null = null

export const getBtcSocket = (): Socket => {
  if (!btcSocket || !btcSocket.connected) {
    btcSocket = io(`${API_BASE_URL}/btc`, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      autoConnect: false, // Don't auto-connect, let the store control it
    })
  }
  return btcSocket
}

export const disconnectBtcSocket = (): void => {
  if (btcSocket) {
    btcSocket.disconnect()
    btcSocket = null
  }
}

// Helper to check if BTC socket is connected
export const isBtcSocketConnected = (): boolean => {
  return btcSocket?.connected ?? false
}

// Guess notifications socket instance
let guessSocket: Socket | null = null

export const getGuessSocket = (): Socket => {
  if (!guessSocket || !guessSocket.connected) {
    guessSocket = io(`${API_BASE_URL}/guesses`, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      autoConnect: false, // Don't auto-connect, let the store control it
    })
  }
  return guessSocket
}

export const disconnectGuessSocket = (): void => {
  if (guessSocket) {
    guessSocket.disconnect()
    guessSocket = null
  }
}

// Helper to check if guess socket is connected
export const isGuessSocketConnected = (): boolean => {
  return guessSocket?.connected ?? false
}
