"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import QuizDisplay from "./quiz-display"
import LoadingSpinner from "./loading-spinner"
import { useQuizApi } from "@/hooks/use-quiz-api"
import { apiClient } from "@/lib/api-client"

export default function GenerateTab() {
  const [url, setUrl] = useState("")
  const [numQuestions, setNumQuestions] = useState(5)
  const [difficulty, setDifficulty] = useState("medium")
  const [urlError, setUrlError] = useState("")
  const { generateQuiz, loading, error, quiz, clearQuiz } = useQuizApi()

  const handleGenerateQuiz = async () => {
    setUrlError("")

    if (!url.trim()) {
      setUrlError("Please enter a Wikipedia URL")
      return
    }

    const isValidUrl = await apiClient.validateUrl(url)
    if (!isValidUrl) {
      setUrlError("Please enter a valid Wikipedia URL")
      return
    }

    await generateQuiz({
      wikipedia_url: url,
      num_questions: numQuestions,
      difficulty: difficulty as "easy" | "medium" | "hard",
    })
  }

  if (quiz && !loading) {
    return <QuizDisplay quiz={quiz} onNewQuiz={clearQuiz} />
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Create New Quiz</CardTitle>
        <CardDescription className="text-slate-400">Enter a Wikipedia URL to generate a quiz</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* URL Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Wikipedia URL</label>
          <Input
            placeholder="https://en.wikipedia.org/wiki/Machine_Learning"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
              setUrlError("")
            }}
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
          />
          {urlError && <p className="text-red-400 text-sm">{urlError}</p>}
        </div>

        {/* Number of Questions */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Number of Questions</label>
          <select
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number.parseInt(e.target.value))}
            className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
          >
            {[3, 5, 7, 10].map((num) => (
              <option key={num} value={num}>
                {num} Questions
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Level */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Difficulty Level</label>
          <div className="grid grid-cols-3 gap-2">
            {["easy", "medium", "hard"].map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  difficulty === level ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && <div className="p-3 bg-red-900 border border-red-700 rounded-md text-red-100 text-sm">{error}</div>}

        {/* Generate Button */}
        <Button
          onClick={handleGenerateQuiz}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <LoadingSpinner />
              Generating Quiz...
            </div>
          ) : (
            "Generate Quiz"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
