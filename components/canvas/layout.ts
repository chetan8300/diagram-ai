import ELK from "elkjs/lib/elk.bundled.js"

import { DiagramSchema, type Diagram, type DiagramNode } from "../../lib/ai/schemas"

export const DIAGRAM_NODE_SIZE = { width: 160, height: 80 } as const

export const DIAGRAM_LAYOUT_OPTIONS = {
  "elk.algorithm": "layered",
  "elk.direction": "RIGHT",
  "elk.spacing.nodeNode": "60",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
} as const

export type LaidOutNode = DiagramNode & {
  position: { x: number; y: number }
}

export type LaidOutDiagram = Omit<Diagram, "nodes"> & { nodes: LaidOutNode[] }

export async function layoutDiagram(input: Diagram): Promise<LaidOutDiagram> {
  const diagram = DiagramSchema.parse(input)
  const elk = new ELK()
  const graph = await elk.layout({
    id: "root",
    layoutOptions: DIAGRAM_LAYOUT_OPTIONS,
    children: diagram.nodes.map((node) => ({ id: node.id, ...DIAGRAM_NODE_SIZE })),
    edges: diagram.edges.map((edge, index) => ({
      id: `edge-${index}`,
      sources: [edge.from],
      targets: [edge.to],
    })),
  })
  const positions = new Map(graph.children?.map((node) => [node.id, node]))
  return {
    ...diagram,
    nodes: diagram.nodes.map((node) => {
      const position = positions.get(node.id)
      if (!position || !Number.isFinite(position.x) || !Number.isFinite(position.y)) {
        throw new Error(`Layout did not return a valid position for ${node.id}`)
      }
      return { ...node, position: { x: position.x!, y: position.y! } }
    }),
  }
}
