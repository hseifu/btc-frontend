import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { GuessDirection, useGuessesStore } from '@/store/guessesStore'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { useState } from 'react'

export const GuessCard = () => {
  const { createGuess, isLoading } = useGuessesStore()
  const [showSuccess, setShowSuccess] = useState(false)

  const handleGuess = async (direction: GuessDirection) => {
    try {
      await createGuess(direction)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to create guess:', error)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Make Your Prediction</h2>
      <p className="text-sm text-gray-600 mb-4">
        Will BTC price go up or down in the next 60 seconds?
      </p>

      <div className="flex gap-4">
        <Button
          onClick={() => handleGuess(GuessDirection.UP)}
          disabled={isLoading}
          className="flex-1 h-20 bg-green-600 hover:bg-green-700 text-white"
        >
          <ArrowUp className="mr-2 h-6 w-6" />
          <div>
            <div className="text-lg font-bold">UP</div>
            <div className="text-xs">+10 points</div>
          </div>
        </Button>

        <Button
          onClick={() => handleGuess(GuessDirection.DOWN)}
          disabled={isLoading}
          className="flex-1 h-20 bg-red-600 hover:bg-red-700 text-white"
        >
          <ArrowDown className="mr-2 h-6 w-6" />
          <div>
            <div className="text-lg font-bold">DOWN</div>
            <div className="text-xs">+10 points</div>
          </div>
        </Button>
      </div>

      {showSuccess && (
        <Badge className="mt-4 w-full justify-center bg-blue-600 text-white">
          Guess submitted! Check back in 60 seconds for results.
        </Badge>
      )}
    </Card>
  )
}
