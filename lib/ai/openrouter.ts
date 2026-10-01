import "server-only"

import { createOpenRouter } from "@openrouter/ai-sdk-provider"

export function getDiagramModel() {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim()
  const model = process.env.OPENROUTER_MODEL?.trim()
  if (!apiKey || !model || apiKey === "your_api_key_here") return null

  return createOpenRouter({ apiKey }).chat(model, {
    provider: { require_parameters: true },
  })
}
