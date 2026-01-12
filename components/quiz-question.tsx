"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface QuizQuestion {
  question: string
  options: string[]
  correct_answer: string
  explanation: string
  difficulty: string
  related_topics: string[]
}

interface Props {
  question: QuizQuestion
  onSelectAnswer: (answer: string) => void
  selectedAnswer: string | null
  onShowExplanation: () => void
  showExplanation: boolean
}

export default function QuizQuestion({
  question,
  onSelectAnswer,
  selectedAnswer,
  onShowExplanation,
  showExplanation,
}: Props) {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy":
        return "bg-green-900 text-green-100"
      case "hard":
        return "bg-red-900 text-red-100"
      default:
        return "bg-yellow-900 text-yellow-100"
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex justify-between items-start">
          <h3 className="text-white text-lg font-semibold">{question.question}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Options */}
        <div className="grid gap-2">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => onSelectAnswer(option)}
              className={`p-3 text-left rounded-md transition-all border-2 ${
                selectedAnswer === option
                  ? option === question.correct_answer
                    ? "border-green-500 bg-green-900 text-green-100"
                    : "border-red-500 bg-red-900 text-red-100"
                  : "border-slate-600 bg-slate-700 text-white hover:border-slate-500"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Show Explanation Button */}
        {selectedAnswer && !showExplanation && (
          <Button onClick={onShowExplanation} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Show Explanation
          </Button>
        )}

        {/* Explanation */}
        {showExplanation && (
          <div className="p-3 bg-blue-900 border border-blue-700 rounded-md">
            <p className="text-blue-100 text-sm">
              <strong>Explanation:</strong> {question.explanation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
