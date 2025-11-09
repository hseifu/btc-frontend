import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  GuessDirection,
  GuessStatus,
  useGuessesStore,
} from '@/store/guessesStore'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { useState } from 'react'

export const GuessCard = () => {
  const { createGuess, isLoading, myGuesses } = useGuessesStore()
  const [showSuccess, setShowSuccess] = useState(false)

  const handleGuess = async (direction: GuessDirection) => {
    try {
      await createGuess(direction)
      setShowSuccess(true)
      // This is to show the success message for 3 seconds
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to create guess:', error)
    }
  }

  const hasPendingGuess = myGuesses.some(
    (guess) => guess.status === GuessStatus.PENDING,
  )

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Make Your Prediction</h2>
      <p className="text-sm text-gray-600 mb-4">
        Will BTC price go up or down in the next 60 seconds?
      </p>

      <TooltipProvider>
        <div className="flex gap-4">
          <Tooltip>
            <TooltipTrigger asChild className="flex-1">
              <span>
                <Button
                  onClick={() => handleGuess(GuessDirection.UP)}
                  disabled={isLoading || hasPendingGuess}
                  className="w-full h-20 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowUp className="mr-2 h-6 w-6" />
                  <div>
                    <div className="text-lg font-bold">UP</div>
                    <div className="text-xs">+1 points</div>
                  </div>
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {hasPendingGuess
                  ? 'You already have a pending guess'
                  : 'Guess if BTC will go UP'}
              </p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild className="flex-1">
              <span className="flex-1">
                <Button
                  onClick={() => handleGuess(GuessDirection.DOWN)}
                  disabled={isLoading || hasPendingGuess}
                  className="w-full h-20 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowDown className="mr-2 h-6 w-6" />
                  <div>
                    <div className="text-lg font-bold">DOWN</div>
                    <div className="text-xs">+1 points</div>
                  </div>
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {hasPendingGuess
                  ? 'You already have a pending guess'
                  : 'Guess if BTC will go DOWN'}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {showSuccess && (
        <Badge className="mt-4 w-full justify-center bg-blue-600 text-white">
          Guess submitted! Check back in 60 seconds for results.
        </Badge>
      )}
    </Card>
  )
}
