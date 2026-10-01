import {
  createShapeId,
  getSnapshot,
  loadSnapshot,
  toRichText,
  type Editor,
  type TLShapePartial,
  type TLBindingCreate,
} from "tldraw"

import { DIAGRAM_NODE_SIZE, type LaidOutDiagram } from "@/components/canvas/layout"
// Include custom shape types in tldraw's global shape map.
import type {} from "@/components/canvas/shapes/shape-utils"

export function diagramToTldrawShapes(diagram: LaidOutDiagram) {
  const nodeIds = new Map(diagram.nodes.map((node) => [node.id, createShapeId()]))
  const shapes: TLShapePartial[] = diagram.nodes.map((node) => {
    const base = {
      id: nodeIds.get(node.id)!,
      x: node.position.x,
      y: node.position.y,
      meta: { diagramNodeId: node.id, diagramNodeType: node.type, ...node.metadata },
    }
    const size = { w: DIAGRAM_NODE_SIZE.width, h: DIAGRAM_NODE_SIZE.height }
    switch (node.type) {
      case "service":
      case "database":
      case "queue":
        return { ...base, type: node.type, props: { ...size, label: node.label } }
      default:
        return { ...base, type: "geo", props: { ...size, geo: "rectangle", richText: toRichText(node.label) } }
    }
  })
  const nodes = new Map(diagram.nodes.map((node) => [node.id, node]))
  const bindings: TLBindingCreate[] = []
  diagram.edges.forEach((edge) => {
    const from = nodes.get(edge.from)
    const to = nodes.get(edge.to)
    if (!from || !to) throw new Error("Cannot map an edge with missing endpoints")
    const arrowId = createShapeId()
    const center = { x: DIAGRAM_NODE_SIZE.width / 2, y: DIAGRAM_NODE_SIZE.height / 2 }
    shapes.push({
      id: arrowId,
      type: "arrow",
      x: from.position.x + center.x,
      y: from.position.y + center.y,
      props: {
        start: { x: 0, y: 0 },
        end: { x: to.position.x - from.position.x, y: to.position.y - from.position.y },
        richText: toRichText(edge.label ?? ""),
        dash: edge.style === "solid" ? "solid" : edge.style === "dashed" ? "dashed" : "dotted",
        arrowheadStart: edge.direction === "two-way" ? "arrow" : "none",
        arrowheadEnd: "arrow",
      },
    })
    for (const terminal of ["start", "end"] as const) {
      bindings.push({
        type: "arrow",
        fromId: arrowId,
        toId: nodeIds.get(terminal === "start" ? edge.from : edge.to)!,
        props: { terminal, normalizedAnchor: { x: 0.5, y: 0.5 }, isExact: false, isPrecise: false },
      })
    }
  })
  return { shapes, bindings }
}

export function addDiagramToCanvas(editor: Editor, diagram: LaidOutDiagram) {
  const { shapes, bindings } = diagramToTldrawShapes(diagram)
  editor.run(() => {
    editor.createShapes(shapes)
    editor.createBindings(bindings)
  })
}

/** Replace the current page as one undoable edit, restoring it if application fails. */
export function replaceDiagramOnCanvas(editor: Editor, diagram: LaidOutDiagram) {
  const { shapes, bindings } = diagramToTldrawShapes(diagram)
  const snapshot = getSnapshot(editor.store)
  editor.markHistoryStoppingPoint("Generate diagram")
  try {
    editor.run(() => {
      editor.deleteShapes([...editor.getCurrentPageShapeIds()])
      editor.createShapes(shapes)
      editor.createBindings(bindings)
    }, { ignoreShapeLock: true })
  } catch (error) {
    loadSnapshot(editor.store, snapshot)
    throw error
  }
}
