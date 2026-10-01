import { z } from "zod"

export const NodeSchema = z.object({
  id: z.string().trim().min(1).max(100),
  type: z.enum(["service", "database", "queue", "user", "external", "group"]),
  label: z.string().trim().min(1).max(50),
  metadata: z.object({
    technology: z.string().max(100).optional(),
    description: z.string().max(500).optional(),
  }).optional(),
})

export const EdgeSchema = z.object({
  from: z.string().trim().min(1).max(100),
  to: z.string().trim().min(1).max(100),
  label: z.string().max(100).optional(),
  style: z.enum(["solid", "dashed", "dotted"]).default("solid"),
  direction: z.enum(["one-way", "two-way"]).default("one-way"),
})

export const DiagramSchema = z.object({
  title: z.string().trim().min(1).max(100),
  description: z.string().max(1000).optional(),
  nodes: z.array(NodeSchema).min(1).max(40),
  edges: z.array(EdgeSchema).max(80),
}).superRefine((diagram, ctx) => {
  const nodeIds = new Set<string>()
  diagram.nodes.forEach((node, index) => {
    if (nodeIds.has(node.id)) {
      ctx.addIssue({ code: "custom", message: "Node IDs must be unique", path: ["nodes", index, "id"] })
    }
    nodeIds.add(node.id)
  })
  diagram.edges.forEach((edge, index) => {
    for (const endpoint of ["from", "to"] as const) {
      if (!nodeIds.has(edge[endpoint])) {
        ctx.addIssue({ code: "custom", message: "Edge endpoint must reference an existing node", path: ["edges", index, endpoint] })
      }
    }
  })
})

export type Diagram = z.infer<typeof DiagramSchema>
export type DiagramNode = z.infer<typeof NodeSchema>
