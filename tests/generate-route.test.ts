import assert from "node:assert/strict"
import { afterEach, test } from "node:test"

import { POST } from "../app/api/generate/route"
import { SAMPLE_DIAGRAM } from "../lib/diagram/sample"

const originalFetch = globalThis.fetch
const originalKey = process.env.OPENROUTER_API_KEY
const originalModel = process.env.OPENROUTER_MODEL

afterEach(() => {
  globalThis.fetch = originalFetch
  if (originalKey === undefined) delete process.env.OPENROUTER_API_KEY
  else process.env.OPENROUTER_API_KEY = originalKey
  if (originalModel === undefined) delete process.env.OPENROUTER_MODEL
  else process.env.OPENROUTER_MODEL = originalModel
})

function request(body: unknown) {
  return new Request("http://localhost/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

function configure() {
  process.env.OPENROUTER_API_KEY = "test-key"
  process.env.OPENROUTER_MODEL = "test/model"
}

function mockOutput(output: unknown) {
  globalThis.fetch = async (_url, options) => {
    const body = JSON.parse(String(options?.body))
    assert.equal(body.response_format.type, "json_schema")
    assert.equal(body.provider.require_parameters, true)
    return Response.json({
      id: "test-completion",
      model: "test/model",
      created: 1,
      choices: [{ index: 0, finish_reason: "stop", message: { role: "assistant", content: JSON.stringify(output) } }],
      usage: { prompt_tokens: 10, completion_tokens: 10, total_tokens: 20 },
    })
  }
}

test("rejects malformed JSON and invalid prompts before contacting the provider", async () => {
  globalThis.fetch = async () => { throw new Error("Provider must not be called") }
  const malformed = new Request("http://localhost/api/generate", { method: "POST", body: "{" })
  assert.equal((await POST(malformed)).status, 400)
  for (const body of [{}, {prompt:"   "}, {prompt:42}, {prompt:"a".repeat(4001)}]) {
    assert.equal((await POST(request(body))).status, 400)
  }
})

test("reports missing server configuration without calling OpenRouter", async () => {
  delete process.env.OPENROUTER_API_KEY
  delete process.env.OPENROUTER_MODEL
  assert.equal((await POST(request({ prompt: "An API and a database" }))).status, 503)
})

test("generates and validates a structured diagram through the real SDK with mocked HTTP", async () => {
  configure()
  mockOutput(SAMPLE_DIAGRAM)
  const response = await POST(request({ prompt: "An API and background jobs" }))
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), SAMPLE_DIAGRAM)
})

test("rejects dangling references in provider output", async () => {
  configure()
  mockOutput({ ...SAMPLE_DIAGRAM, edges: [{ from: "api", to: "missing" }] })
  const response = await POST(request({ prompt: "An API and a database" }))
  assert.equal(response.status, 502)
})

test("returns a safe retryable error instead of provider response details", async () => {
  configure()
  globalThis.fetch = async () => Response.json({ error: { message: "private-provider-detail test-key" } }, {status:401})
  const response = await POST(request({ prompt: "An API" }))
  assert.equal(response.status, 502)
  const body = await response.text()
  assert.ok(!body.includes("private-provider-detail"))
  assert.ok(!body.includes("test-key"))
})
