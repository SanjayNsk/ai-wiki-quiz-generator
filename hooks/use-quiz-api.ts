"use client"

import { useState } from "react"
import { apiClient, type Quiz, type QuizRequest } from "@/lib/api-client"

interface UseQuizApiState {
  loading: boolean
  error: string | null
  quiz: Quiz | null
  quizzes: Quiz[]
}

export function useQuizApi() {
  const [state, setState] = useState<UseQuizApiState>({
    loading: false,
    error: null,
    quiz: null,
    quizzes: [],
  })

  const generateQuiz = async (request: QuizRequest) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const quiz = await apiClient.generateQuiz(request)
      await apiClient.storeQuiz(quiz)
      setState((prev) => ({ ...prev, quiz, loading: false }))
      return quiz
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "An error occurred"
      setState((prev) => ({ ...prev, error: errorMsg, loading: false }))
      throw error
    }
  }

  const fetchQuizzes = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const quizzes = await apiClient.getQuizzes()
      setState((prev) => ({ ...prev, quizzes, loading: false }))
      return quizzes
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "An error occurred"
      setState((prev) => ({ ...prev, error: errorMsg, loading: false }))
      throw error
    }
  }

  const clearQuiz = () => {
    setState((prev) => ({ ...prev, quiz: null }))
  }

  return {
    ...state,
    generateQuiz,
    fetchQuizzes,
    clearQuiz,
  }
}
