import { useEffect, useState } from 'react'

interface CountdownTimerProps {
  createdAt: string
  validationTimeSeconds?: number
}

export const CountdownTimer = ({
  createdAt,
  validationTimeSeconds = 60,
}: CountdownTimerProps) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0)

  useEffect(() => {
    const calculateRemaining = () => {
      const created = new Date(createdAt).getTime()
      const now = Date.now()
      const elapsed = Math.floor((now - created) / 1000)
      const remaining = Math.max(0, validationTimeSeconds - elapsed)
      return remaining
    }

    setSecondsRemaining(calculateRemaining())

    const interval = setInterval(() => {
      const remaining = calculateRemaining()
      setSecondsRemaining(remaining)

      if (remaining <= 0) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [createdAt, validationTimeSeconds])

  if (secondsRemaining <= 0) {
    return <span className="text-xs text-gray-500">(evaluating...)</span>
  }

  return (
    <span className="text-xs text-gray-600 font-mono">
      ({secondsRemaining}s)
    </span>
  )
}
