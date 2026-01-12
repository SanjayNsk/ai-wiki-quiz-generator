"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  score: number
  total: number
  onRetry: () => void
  onBack: () => void
}

export default function QuizResults({ score, total, onRetry, onBack }: Props) {
  const percentage = Math.round((score / total) * 100)
  const getResultMessage = (pct: number) => {
    if (pct === 100) return "Perfect Score!"
    if (pct >= 80) return "Excellent!"
    if (pct >= 60) return "Good Job!"
    return "Keep Learning!"
  }

  const getResultColor = (pct: number) => {
    if (pct === 100) return "text-green-400"
    if (pct >= 80) return "text-blue-400"
    if (pct >= 60) return "text-yellow-400"
    return "text-orange-400"
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="bg-slate-800 border-slate-700 w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className={`text-4xl font-bold ${getResultColor(percentage)}`}>
            {getResultMessage(percentage)}
          </CardTitle>
          <CardDescription className="text-slate-400">Quiz Complete</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-slate-400 text-sm">Your Score</p>
            <p className="text-white text-5xl font-bold">
              {score}/{total}
            </p>
            <p className="text-slate-400 text-lg">{percentage}%</p>
          </div>

          <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600" style={{ width: `${percentage}%` }} />
          </div>

          <div className="space-y-3">
            <Button onClick={onRetry} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Retake Quiz
            </Button>
            <Button
              onClick={onBack}
              variant="outline"
              className="w-full text-white border-slate-600 hover:bg-slate-700 bg-transparent"
            >
              Back to Quiz View
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
