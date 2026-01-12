import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for generated quizzes
const quizzes: any[] = []

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ quizzes })
  } catch (error) {
    console.error("[v0] Fetch quizzes error:", error)
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const quiz = await request.json()
    quizzes.push(quiz)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Store quiz error:", error)
    return NextResponse.json({ error: "Failed to store quiz" }, { status: 500 })
  }
}
