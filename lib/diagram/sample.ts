import type { Diagram } from "@/lib/ai/schemas"

export const SAMPLE_DIAGRAM: Diagram = {
  title: "Web application architecture",
  description: "An API stores data and sends background jobs to a worker through a queue.",
  nodes: [
    { id: "api", type: "service", label: "API server" },
    { id: "database", type: "database", label: "PostgreSQL" },
    { id: "queue", type: "queue", label: "Message queue" },
    { id: "worker", type: "service", label: "Background worker" },
  ],
  edges: [
    { from: "api", to: "database", label: "Read / write", style: "solid", direction: "two-way" },
    { from: "api", to: "queue", label: "Enqueue job", style: "solid", direction: "one-way" },
    { from: "queue", to: "worker", label: "Process job", style: "dashed", direction: "one-way" },
  ],
}
