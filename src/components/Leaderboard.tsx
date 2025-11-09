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
import { useScoresStore } from '@/store/scoresStore'
import { Trophy } from 'lucide-react'
import { useEffect } from 'react'

export const Leaderboard = () => {
  const { scores, isLoading, fetchLeaderboard } = useScoresStore()

  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-yellow-600" />
        <h2 className="text-xl font-semibold">Leaderboard</h2>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : scores.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No scores yet. Be the first to make a guess!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Points</TableHead>
                <TableHead className="text-right">Wins</TableHead>
                <TableHead className="text-right">Losses</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scores.map((score, index) => (
                <TableRow key={score.id}>
                  <TableCell className="font-medium">
                    {index === 0 && (
                      <Badge className="bg-yellow-600">#{index + 1}</Badge>
                    )}
                    {index === 1 && (
                      <Badge className="bg-gray-400">#{index + 1}</Badge>
                    )}
                    {index === 2 && (
                      <Badge className="bg-amber-700">#{index + 1}</Badge>
                    )}
                    {index > 2 && `#${index + 1}`}
                  </TableCell>
                  <TableCell className="font-medium">
                    {score.user?.name || score.user?.email || 'Anonymous'}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {score.points}
                  </TableCell>
                  <TableCell className="text-right text-green-600">
                    {score.wins}
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    {score.losses}
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
