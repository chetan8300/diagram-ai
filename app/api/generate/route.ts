import { generateText, Output } from "ai"
import { z } from "zod"

import { getDiagramModel } from "@/lib/ai/openrouter"
import { GENERATION_SYSTEM_PROMPT } from "@/lib/ai/prompts"
import { DiagramSchema } from "@/lib/ai/schemas"

export const maxDuration = 90

const RequestSchema = z.object({ prompt: z.string().trim().min(1).max(4000) })

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Send a valid JSON request." }, { status: 400 })
  }
  const parsed = RequestSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: "Describe a diagram using 1 to 4,000 characters." }, { status: 400 })
  }
  const model = getDiagramModel()
  if (!model) {
    return Response.json({ error: "Set OPENROUTER_API_KEY and OPENROUTER_MODEL in .env.local to generate diagrams." }, { status: 503 })
  }

  const timeout = AbortSignal.timeout(75_000)
  try {
    const { output } = await generateText({
      model,
      output: Output.object({ schema: DiagramSchema }),
      system: GENERATION_SYSTEM_PROMPT,
      prompt: parsed.data.prompt,
      maxOutputTokens: 6000,
      maxRetries: 0,
      abortSignal: AbortSignal.any([request.signal, timeout]),
    })
    return Response.json(DiagramSchema.parse(output))
  } catch (error) {
    console.error("Error generating diagram:", error)
    // Provider errors can contain credentials or request details; return safe copy.
    return Response.json({
      error: timeout.aborted
        ? "Generation took too long. Please try again with a shorter description."
        : "Could not generate a valid diagram. Try again, or check the OpenRouter configuration and model support for structured output.",
    }, { status: timeout.aborted ? 504 : 502 })
  }
}
