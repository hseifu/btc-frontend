import { Skeleton } from '@/components/ui/skeleton'
import {
  Ticker,
  TickerIcon,
  TickerPrice,
  TickerPriceChange,
  TickerSymbol,
} from '@/components/ui/ticker'
import { useAuthStore } from '@/store/authStore'
import { useBtcStore } from '@/store/btcStore'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { btcPriceData, isLoading, error, fetchBtcPriceData } = useBtcStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (isAuthenticated) {
      fetchBtcPriceData()
    }
  }, [isAuthenticated, fetchBtcPriceData])

  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between align-top">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome, {user.name}!
            </h1>
          </div>
          <div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white text-red-600 rounded-md hover:bg-red-700 hover:text-white transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="space-y-4 w-full flex flex-col items-center justify-center">
          <div>
            {isLoading ? (
              <Skeleton className="w-full h-10" />
            ) : btcPriceData ? (
              <Ticker>
                <TickerIcon
                  src="https://s2.coinmarketcap.com/static/img/coins/64x64/1.png"
                  symbol="GOOG"
                />
                <TickerSymbol symbol="BTC" />
                <TickerPrice price={btcPriceData.price} />
                <TickerPriceChange change={btcPriceData.priceChangeLast24h} />
              </Ticker>
            ) : (
              <div>
                <p>No BTC price data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
