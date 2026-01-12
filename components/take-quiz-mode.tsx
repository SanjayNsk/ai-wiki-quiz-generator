"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import QuizQuestionComponent from "./quiz-question"
import QuizResults from "./quiz-results"

interface QuizQuestion {
  question: string
  options: string[]
  correct_answer: string
  explanation: string
  difficulty: string
  related_topics: string[]
}

interface Quiz {
  id: string
  title: string
  url: string
  questions: QuizQuestion[]
  created_at: string
  difficulty: string
}

interface Props {
  quiz: Quiz
  onComplete: (results: { score: number; total: number; answers: Record<number, string> }) => void
  onBack: () => void
}

export default function TakeQuizMode({ quiz, onComplete, onBack }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)

  const question = quiz.questions[currentQuestion]
  const isLastQuestion = currentQuestion === quiz.questions.length - 1
  const currentAnswer = selectedAnswers[currentQuestion]

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answer,
    }))
  }

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResults()
    }
  }

  const calculateResults = () => {
    let score = 0
    quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct_answer) {
        score++
      }
    })
    onComplete({
      score,
      total: quiz.questions.length,
      answers: selectedAnswers,
    })
    setShowResults(true)
  }

  if (showResults) {
    const score = Object.keys(selectedAnswers).reduce((acc, idx) => {
      return (
        acc + (selectedAnswers[Number.parseInt(idx)] === quiz.questions[Number.parseInt(idx)].correct_answer ? 1 : 0)
      )
    }, 0)

    return (
      <QuizResults
        score={score}
        total={quiz.questions.length}
        onRetry={() => {
          setCurrentQuestion(0)
          setSelectedAnswers({})
          setShowResults(false)
        }}
        onBack={onBack}
      />
    )
  }

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-white text-2xl">{quiz.title}</CardTitle>
              <CardDescription className="text-slate-400">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-sm">Progress</p>
              <p className="text-white font-bold">{Math.round(progress)}%</p>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-700 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </CardHeader>
      </Card>

      {/* Question */}
      <QuizQuestionComponent
        question={question}
        onSelectAnswer={handleSelectAnswer}
        selectedAnswer={currentAnswer || null}
        onShowExplanation={() => {}}
        showExplanation={false}
      />

      {/* Navigation */}
      <div className="flex gap-3 justify-between">
        <Button
          onClick={onBack}
          variant="outline"
          className="text-white border-slate-600 hover:bg-slate-700 bg-transparent"
        >
          Exit Quiz
        </Button>

        <div className="flex gap-2">
          <Button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            variant="outline"
            className="text-white border-slate-600 hover:bg-slate-700 bg-transparent"
          >
            Previous
          </Button>
          <Button onClick={handleNext} disabled={!currentAnswer} className="bg-blue-600 hover:bg-blue-700 text-white">
            {isLastQuestion ? "Submit Quiz" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  )
}
