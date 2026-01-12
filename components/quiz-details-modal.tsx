"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
  created_at: string
  difficulty: string
  questions: QuizQuestion[]
  score?: number
}

interface Props {
  quiz: Quiz
  onClose: () => void
}

export default function QuizDetailsModal({ quiz, onClose }: Props) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{quiz.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-sm">Difficulty</p>
              <p className="text-white font-semibold">{quiz.difficulty}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Questions</p>
              <p className="text-white font-semibold">{quiz.questions.length}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Created</p>
              <p className="text-white font-semibold">{new Date(quiz.created_at).toLocaleDateString()}</p>
            </div>
            {quiz.score !== undefined && (
              <div>
                <p className="text-slate-400 text-sm">Score</p>
                <p className="text-white font-semibold">{quiz.score}</p>
              </div>
            )}
          </div>

          <div className="border-t border-slate-700 pt-4">
            <h4 className="text-white font-semibold mb-3">Questions Preview</h4>
            <div className="space-y-3">
              {quiz.questions.slice(0, 3).map((q, idx) => (
                <Card key={idx} className="bg-slate-700 border-slate-600">
                  <CardContent className="pt-4">
                    <p className="text-white text-sm font-medium">{q.question}</p>
                    <p className="text-slate-400 text-xs mt-2">{q.options.length} options</p>
                  </CardContent>
                </Card>
              ))}
              {quiz.questions.length > 3 && (
                <p className="text-slate-400 text-sm">+{quiz.questions.length - 3} more questions</p>
              )}
            </div>
          </div>

          <Button
            onClick={() => window.open(quiz.url, "_blank")}
            variant="outline"
            className="w-full border-slate-600 text-white hover:bg-slate-700"
          >
            View Original Article
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
