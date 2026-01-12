import { type NextRequest, NextResponse } from "next/server"

const mockQuizzes: Record<string, any> = {
  "machine-learning": {
    title: "Machine Learning Fundamentals",
    questions: [
      {
        question: "What is the primary goal of machine learning?",
        options: [
          "To enable computers to learn from data without being explicitly programmed",
          "To create artificial general intelligence",
          "To replace human decision-making",
          "To optimize hardware performance",
        ],
        correct_answer: "To enable computers to learn from data without being explicitly programmed",
        explanation:
          "Machine learning focuses on creating algorithms that can learn patterns from data and make predictions or decisions without explicit programming for every case.",
        difficulty: "easy",
        related_topics: ["Artificial Intelligence", "Neural Networks", "Deep Learning"],
      },
      {
        question: "Which of the following is a supervised learning algorithm?",
        options: ["K-means clustering", "Linear regression", "Principal Component Analysis", "DBSCAN"],
        correct_answer: "Linear regression",
        explanation:
          "Linear regression is a supervised learning algorithm because it requires labeled data (input-output pairs) to train the model.",
        difficulty: "medium",
        related_topics: ["Supervised Learning", "Regression", "Statistical Models"],
      },
      {
        question: "What does the term 'overfitting' mean in machine learning?",
        options: [
          "The model performs too well on training data",
          "The model learns the noise in the training data rather than the underlying pattern",
          "The model has too many features",
          "The model is not trained enough",
        ],
        correct_answer: "The model learns the noise in the training data rather than the underlying pattern",
        explanation:
          "Overfitting occurs when a model becomes too complex and learns specific details and noise from the training data, leading to poor performance on new, unseen data.",
        difficulty: "hard",
        related_topics: ["Model Validation", "Regularization", "Cross-validation"],
      },
    ],
  },
  "quantum-computing": {
    title: "Quantum Computing Basics",
    questions: [
      {
        question: "What is a qubit?",
        options: [
          "A quantum bit that can be 0, 1, or both simultaneously",
          "A regular computer bit",
          "A unit of quantum energy",
          "A quantum algorithm",
        ],
        correct_answer: "A quantum bit that can be 0, 1, or both simultaneously",
        explanation:
          "A qubit (quantum bit) is the basic unit of quantum information. Unlike classical bits, qubits can exist in a superposition of both 0 and 1 states simultaneously.",
        difficulty: "easy",
        related_topics: ["Quantum Mechanics", "Superposition", "Entanglement"],
      },
      {
        question: "What is quantum entanglement?",
        options: [
          "When two qubits are connected and their states are correlated",
          "A type of quantum algorithm",
          "The process of creating qubits",
          "A quantum error",
        ],
        correct_answer: "When two qubits are connected and their states are correlated",
        explanation:
          "Quantum entanglement is a phenomenon where two or more qubits become correlated such that the state of one qubit instantly influences the state of another, regardless of distance.",
        difficulty: "medium",
        related_topics: ["Quantum Mechanics", "Quantum Computing", "Bell States"],
      },
    ],
  },
  "python-programming": {
    title: "Python Programming Basics",
    questions: [
      {
        question: "What is the main purpose of Python?",
        options: [
          "A general-purpose programming language emphasizing code readability",
          "To build only web applications",
          "To replace JavaScript",
          "For low-level system programming only",
        ],
        correct_answer: "A general-purpose programming language emphasizing code readability",
        explanation:
          "Python is designed to be a general-purpose language with an emphasis on code readability and simplicity, making it suitable for many domains including web development, data science, and automation.",
        difficulty: "easy",
        related_topics: ["Programming Languages", "Syntax", "Best Practices"],
      },
      {
        question: "Which data structure is immutable in Python?",
        options: ["List", "Dictionary", "Tuple", "Set"],
        correct_answer: "Tuple",
        explanation:
          "Tuples are immutable sequences in Python, meaning once created, their elements cannot be changed. Lists, dictionaries, and sets are all mutable data structures.",
        difficulty: "medium",
        related_topics: ["Data Structures", "Python Types", "Memory Management"],
      },
    ],
  },
}

function extractWikiSlug(url: string): string {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const match = pathname.match(/\/wiki\/([^/]+)$/)
    if (match) {
      return match[1].toLowerCase().replace(/_/g, "-")
    }
  } catch {
    return ""
  }
  return ""
}

function generateMockQuiz(slug: string, difficulty: string, numQuestions: number) {
  const baseQuiz = mockQuizzes[slug] || mockQuizzes["machine-learning"]
  const filteredQuestions = baseQuiz.questions
    .filter((q: any) => q.difficulty === difficulty || difficulty === "mixed")
    .slice(0, numQuestions)

  return {
    id: `quiz-${Date.now()}`,
    title: baseQuiz.title,
    url: `https://en.wikipedia.org/wiki/${slug}`,
    questions: filteredQuestions.length > 0 ? filteredQuestions : baseQuiz.questions.slice(0, numQuestions),
    created_at: new Date().toISOString(),
    difficulty: difficulty,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { wikipedia_url, num_questions, difficulty } = body

    console.log("[v0] POST /api/generate-quiz - Body:", body)

    if (!wikipedia_url || typeof num_questions !== "number" || !difficulty) {
      console.log("[v0] Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const slug = extractWikiSlug(wikipedia_url)
    console.log("[v0] Extracted wiki slug:", slug)

    if (!slug) {
      return NextResponse.json({ error: "Invalid Wikipedia URL" }, { status: 400 })
    }

    const quiz = generateMockQuiz(slug, difficulty, num_questions)
    console.log("[v0] Generated quiz:", quiz.id)

    return NextResponse.json(quiz)
  } catch (error) {
    console.error("[v0] Quiz generation error:", error)
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 })
  }
}
