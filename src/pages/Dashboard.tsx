import { GuessCard } from '@/components/GuessCard'
import { GuessHistory } from '@/components/GuessHistory'
import { Leaderboard } from '@/components/Leaderboard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
import { useScoresStore } from '@/store/scoresStore'
import { RefreshCw } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { btcPriceData, isLoading, fetchBtcPriceData } = useBtcStore()
  const { myScore, fetchMyScore } = useScoresStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchBtcPriceData()
      fetchMyScore(user.id)

      // Refresh BTC price every 30 seconds
      const interval = setInterval(fetchBtcPriceData, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated, user, fetchBtcPriceData, fetchMyScore])

  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Welcome, {user.name}!
              </h1>
              {myScore && (
                <div className="flex gap-2 mt-2">
                  <Badge className="bg-blue-600">
                    Points: {myScore.points}
                  </Badge>
                  <Badge className="bg-green-600">Wins: {myScore.wins}</Badge>
                  <Badge className="bg-red-600">Losses: {myScore.losses}</Badge>
                </div>
              )}
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-red-600 hover:bg-red-50"
            >
              Logout
            </Button>
          </div>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              {isLoading ? (
                <Skeleton className="w-64 h-10" />
              ) : btcPriceData ? (
                <Ticker>
                  <TickerIcon
                    src="https://s2.coinmarketcap.com/static/img/coins/64x64/1.png"
                    symbol="BTC"
                  />
                  <TickerSymbol symbol="BTC" />
                  <TickerPrice price={btcPriceData.price} />
                  <TickerPriceChange change={btcPriceData.priceChangeLast24h} />
                </Ticker>
              ) : (
                <p className="text-gray-500">No BTC price data available</p>
              )}
            </div>
            <Button
              onClick={fetchBtcPriceData}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <GuessCard />
            <GuessHistory />
          </div>

          <div className="lg:col-span-1">
            <Leaderboard />
          </div>
        </div>
      </div>
    </div>
  )
}
