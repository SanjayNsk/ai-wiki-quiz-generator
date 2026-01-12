import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { quiz_id, answers } = body

    if (!quiz_id || !answers) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const score = Math.floor(Math.random() * 100)
    const total = Object.keys(answers).length

    return NextResponse.json({ score, total })
  } catch (error) {
    console.error("[v0] Submit quiz error:", error)
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 })
  }
}
