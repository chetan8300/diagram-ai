"use client"

import { useRef, useState, type FormEvent } from "react"

import {
  LoaderCircleIcon,
  ArrowRightIcon,
  GitBranchIcon,
  NetworkIcon,
  SparklesIcon,
  WorkflowIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Diagram } from "@/lib/ai/schemas"

const examplePrompts = [
  {
    title: "System architecture",
    prompt: "A web app with a React frontend, an API server, and a PostgreSQL database.",
    icon: NetworkIcon,
  },
  {
    title: "Flowchart",
    prompt: "A user sign-up flow with email validation and a welcome email.",
    icon: WorkflowIcon,
  },
  {
    title: "Entity relationship",
    prompt: "An online store with customers, orders, products, and order items.",
    icon: GitBranchIcon,
  },
]

interface ChatSidebarProps {
  onGenerate: (prompt: string) => Promise<Diagram>
  canvasReady: boolean
}

export function ChatSidebar({ onGenerate, canvasReady }: ChatSidebarProps) {
  const [prompt, setPrompt] = useState("")
  const [isBusy, setIsBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<{ prompt: string; diagram: Diagram }[]>([])
  const busy = useRef(false)
  const textarea = useRef<HTMLTextAreaElement>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy.current || !canvasReady || !prompt.trim()) return
    busy.current = true
    setIsBusy(true)
    setError(null)
    const submittedPrompt = prompt.trim()
    try {
      const diagram = await onGenerate(submittedPrompt)
      setHistory((previous) => [...previous, { prompt: submittedPrompt, diagram }].slice(-5))
    } catch (cause) {
      setError(cause instanceof Error && cause.name === "Error"
        ? cause.message
        : "Could not generate the diagram. Please try again. Your prompt and canvas were kept.")
    } finally {
      busy.current = false
      setIsBusy(false)
    }
  }

  return (
    <aside
      aria-labelledby="diagram-panel-title"
      className="flex h-full min-h-0 w-full max-w-sm shrink-0 flex-col bg-card text-card-foreground"
    >
      <header className="border-b px-6 py-5">
        <div className="mb-2 flex items-center gap-2">
          <SparklesIcon aria-hidden="true" className="size-4 text-primary" />
          <h2 id="diagram-panel-title" className="text-sm font-semibold">
            Diagram assistant
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Turn an idea into an editable diagram.
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-8">
        <div className="mb-8">
          <div className="mb-4 flex size-10 items-center justify-center rounded-lg border bg-muted/50">
            <NetworkIcon aria-hidden="true" className="size-5 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold tracking-tight">
            Start with an idea
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Describe the parts of your diagram and how they connect. Once
            generated, you can edit it on the canvas.
          </p>
        </div>

        {history.length > 0 && (
          <section aria-labelledby="generation-history-title" className="mb-8 space-y-3">
            <h3 id="generation-history-title" className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Recent generations
            </h3>
            {history.map((entry, index) => (
              <div key={index} className="space-y-2 rounded-lg border p-3">
                <p className="text-sm wrap-break-word">{entry.prompt}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Created {entry.diagram.title}: {entry.diagram.nodes.length} nodes and {entry.diagram.edges.length} connections.
                </p>
              </div>
            ))}
          </section>
        )}

        <section aria-labelledby="example-prompts-title">
          <h3
            id="example-prompts-title"
            className="mb-3 text-xs font-medium tracking-wider text-muted-foreground uppercase"
          >
            Try an example
          </h3>
          <div className="space-y-3">
            {examplePrompts.map(({ title, prompt, icon: Icon }) => (
              <button
                key={title}
                type="button"
                disabled={isBusy}
                onClick={() => {
                  setPrompt(prompt)
                  setError(null)
                  textarea.current?.focus()
                }}
                className="flex w-full items-start gap-3 rounded-lg border bg-background p-3 text-left hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>
                  <span className="mb-1 block text-sm font-medium">{title}</span>
                  <span className="block text-xs leading-relaxed text-muted-foreground">
                    {prompt}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <footer className="border-t px-6 py-5">
        <form onSubmit={handleSubmit} aria-busy={isBusy} className="space-y-3">
        <div className="space-y-2">
          <label htmlFor="diagram-prompt" className="text-sm font-medium">
            Describe a diagram
          </label>
          <Textarea
            id="diagram-prompt"
            ref={textarea}
            value={prompt}
            onChange={(event) => { setPrompt(event.target.value); setError(null) }}
            maxLength={4000}
            disabled={isBusy}
            required
            placeholder="e.g. A client sends requests to an API, which reads from a database…"
            aria-describedby="diagram-prompt-help"
            className="min-h-28 rounded-lg border border-input bg-background px-3 py-3 text-sm focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
          />
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={isBusy || !canvasReady || !prompt.trim()} className="w-full gap-2 rounded-lg">
          {isBusy ? <LoaderCircleIcon aria-hidden="true" className="animate-spin" /> : <SparklesIcon aria-hidden="true" />}
          {isBusy ? "Generating…" : error ? "Try again" : "Generate"}
          <ArrowRightIcon aria-hidden="true" className="ml-auto" />
        </Button>
        <p id="diagram-prompt-help" className="text-xs leading-relaxed text-muted-foreground">
          Generation replaces the current diagram. You can undo it on the canvas.
        </p>
        <p role="status" className="sr-only">
          {isBusy ? "Generating and arranging your diagram." : history.length > 0 ? "Diagram generation finished." : ""}
        </p>
        </form>
      </footer>
    </aside>
  )
}
