const API_BASE_URL = "" // Always use relative paths in v0 environment

export interface QuizQuestion {
  question: string
  options: string[]
  correct_answer: string
  explanation: string
  difficulty: string
  related_topics: string[]
}

export interface Quiz {
  id: string
  title: string
  url: string
  questions: QuizQuestion[]
  created_at: string
  difficulty: string
  score?: number
}

export interface QuizRequest {
  wikipedia_url: string
  num_questions: number
  difficulty: string
}

export interface QuizSubmission {
  quiz_id: string
  answers: Record<number, string>
}

export const apiClient = {
  async generateQuiz(request: QuizRequest): Promise<Quiz> {
    const url = "/api/generate-quiz"
    console.log("[v0] Generating quiz with URL:", url, "Request:", request)

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      })

      console.log("[v0] Generate quiz response status:", response.status)

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unknown error" }))
        console.log("[v0] Generate quiz error response:", error)
        throw new Error(error.error || "Failed to generate quiz")
      }

      const data = await response.json()
      console.log("[v0] Quiz generated successfully:", data)
      return data
    } catch (error) {
      console.log("[v0] Quiz generation error:", error)
      throw error
    }
  },

  async storeQuiz(quiz: Quiz): Promise<void> {
    const url = "/api/quizzes"
    console.log("[v0] Storing quiz to history:", quiz.id)

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quiz),
      })
      if (!response.ok) throw new Error("Failed to store quiz")
      console.log("[v0] Quiz stored successfully")
    } catch (error) {
      console.log("[v0] Store quiz error:", error)
      throw error
    }
  },

  async getQuizzes(): Promise<Quiz[]> {
    const url = "/api/quizzes"
    console.log("[v0] Fetching quizzes from:", url)

    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch quizzes")
      const data = await response.json()
      return data.quizzes || []
    } catch (error) {
      console.log("[v0] Fetch quizzes error:", error)
      throw error
    }
  },

  async submitQuiz(submission: QuizSubmission): Promise<{ score: number; total: number }> {
    const url = "/api/submit-quiz"

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      })
      if (!response.ok) throw new Error("Failed to submit quiz")
      return response.json()
    } catch (error) {
      console.log("[v0] Submit quiz error:", error)
      throw error
    }
  },

  async submitQuizAnswers(submission: QuizSubmission): Promise<{ score: number; total: number }> {
    const url = "/api/submit-quiz-answers"

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      })
      if (!response.ok) throw new Error("Failed to submit quiz answers")
      return response.json()
    } catch (error) {
      console.log("[v0] Submit quiz answers error:", error)
      throw error
    }
  },

  async validateUrl(url: string): Promise<boolean> {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname.includes("wikipedia.org")
    } catch {
      return false
    }
  },
}
