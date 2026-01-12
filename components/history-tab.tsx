"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import QuizDetailsModal from "./quiz-details-modal"
import { useQuizApi } from "@/hooks/use-quiz-api"

export default function HistoryTab() {
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null)
  const { quizzes, loading, fetchQuizzes } = useQuizApi()

  useEffect(() => {
    fetchQuizzes()
  }, [])

  if (loading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="py-8">
          <p className="text-slate-400 text-center">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  if (quizzes.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="py-8">
          <p className="text-slate-400 text-center">No quizzes yet. Generate one to get started!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-4">
        {quizzes.map((quiz) => (
          <Card
            key={quiz.id}
            className="bg-slate-800 border-slate-700 hover:border-slate-600 cursor-pointer transition-colors"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white">{quiz.title}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {new Date(quiz.created_at).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-blue-900 text-blue-100 rounded-full text-xs font-medium">
                    {quiz.difficulty}
                  </span>
                  <Button onClick={() => setSelectedQuiz(quiz)} className="bg-blue-600 hover:bg-blue-700 text-white">
                    View Details
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm">{quiz.questions.length} questions</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedQuiz && <QuizDetailsModal quiz={selectedQuiz} onClose={() => setSelectedQuiz(null)} />}
    </>
  )
}
