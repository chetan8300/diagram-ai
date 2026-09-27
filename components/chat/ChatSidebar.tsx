"use client"

import {
  ArrowRightIcon,
  GitBranchIcon,
  NetworkIcon,
  SparklesIcon,
  WorkflowIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

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

export function ChatSidebar() {
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
            generated, you can edit it on the canvas or request changes here.
          </p>
        </div>

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
                disabled
                className="flex w-full items-start gap-3 rounded-lg border bg-background p-3 text-left disabled:cursor-not-allowed"
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

      <footer className="space-y-3 border-t px-6 py-5">
        <div className="space-y-2">
          <label htmlFor="diagram-prompt" className="text-sm font-medium">
            Describe a diagram
          </label>
          <Textarea
            id="diagram-prompt"
            placeholder="e.g. A client sends requests to an API, which reads from a database…"
            aria-describedby="diagram-prompt-help"
            className="min-h-28 rounded-lg border border-input bg-background px-3 py-3 text-sm focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
          />
        </div>
        <Button type="button" disabled className="w-full gap-2 rounded-lg">
          <SparklesIcon aria-hidden="true" />
          Generate
          <ArrowRightIcon aria-hidden="true" className="ml-auto" />
        </Button>
        <p id="diagram-prompt-help" className="text-xs leading-relaxed text-muted-foreground">
          UI preview only. Generation and example prompts are not connected yet.
        </p>
      </footer>
    </aside>
  )
}
