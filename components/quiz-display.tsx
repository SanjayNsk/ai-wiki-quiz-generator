"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import QuizQuestionComponent from "./quiz-question"
import TakeQuizMode from "./take-quiz-mode"

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
  onNewQuiz: () => void
}

export default function QuizDisplay({ quiz, onNewQuiz }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isTakingQuiz, setIsTakingQuiz] = useState(false)

  const question = quiz.questions[currentQuestion]
  const isLastQuestion = currentQuestion === quiz.questions.length - 1

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestion(currentQuestion + 1)
      setShowExplanation(false)
      setSelectedAnswer(null)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowExplanation(false)
      setSelectedAnswer(null)
    }
  }

  if (isTakingQuiz) {
    return <TakeQuizMode quiz={quiz} onComplete={() => setIsTakingQuiz(false)} onBack={() => setIsTakingQuiz(false)} />
  }

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-2xl">{quiz.title}</CardTitle>
          <CardDescription className="text-slate-400">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Question Card */}
      <QuizQuestionComponent
        question={question}
        onSelectAnswer={setSelectedAnswer}
        selectedAnswer={selectedAnswer}
        onShowExplanation={() => setShowExplanation(true)}
        showExplanation={showExplanation}
      />

      {/* Related Topics */}
      {question.related_topics.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm text-white">Related Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {question.related_topics.map((topic, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-900 text-blue-100 rounded-full text-sm">
                  {topic}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex gap-3 justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          variant="outline"
          className="text-white border-slate-600 hover:bg-slate-700 bg-transparent"
        >
          Previous
        </Button>

        <div className="flex gap-2">
          <Button onClick={() => setIsTakingQuiz(true)} className="bg-green-600 hover:bg-green-700 text-white">
            Take Quiz Mode
          </Button>
          <Button
            onClick={onNewQuiz}
            variant="outline"
            className="text-white border-slate-600 hover:bg-slate-700 bg-transparent"
          >
            New Quiz
          </Button>
          <Button onClick={handleNext} disabled={isLastQuestion} className="bg-blue-600 hover:bg-blue-700 text-white">
            {isLastQuestion ? "Quiz Complete" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  )
}
