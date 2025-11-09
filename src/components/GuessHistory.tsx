import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { GuessStatus, useGuessesStore } from '@/store/guessesStore'
import { ArrowDown, ArrowUp, Clock, History } from 'lucide-react'
import { useEffect } from 'react'
import { TickerPriceChange } from './ui/ticker'

export const GuessHistory = () => {
  const { myGuesses, isLoading, fetchMyGuesses } = useGuessesStore()

  useEffect(() => {
    fetchMyGuesses()
  }, [fetchMyGuesses])

  const getStatusBadge = (status: GuessStatus) => {
    switch (status) {
      case GuessStatus.PENDING:
        return (
          <Badge className="bg-yellow-600">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case GuessStatus.WON:
        return <Badge className="bg-green-600">Won +1</Badge>
      case GuessStatus.LOST:
        return <Badge className="bg-red-600">Lost -1</Badge>
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Your Guess History</h2>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : myGuesses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No guesses yet. Make your first prediction above!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Predicted Direction</TableHead>
                <TableHead>Initial Price</TableHead>
                <TableHead>Final Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myGuesses.map((guess) => (
                <TableRow key={guess.id}>
                  <TableCell>
                    {guess.direction === 'UP' ? (
                      <div className="flex items-center text-green-600">
                        <ArrowUp className="h-4 w-4 mr-1" />
                        UP
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <ArrowDown className="h-4 w-4 mr-1" />
                        DOWN
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-mono">
                    $
                    {guess.initialPrice.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="font-mono">
                    {guess.finalPrice
                      ? `$${guess.finalPrice.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : '-'}
                    {/* Show ticker showing the price change */}
                    {guess.finalPrice !== null && (
                      <TickerPriceChange
                        change={guess.finalPrice - guess.initialPrice}
                      />
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(guess.status)}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(guess.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  )
}
