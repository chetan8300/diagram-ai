"use client"

import { Tldraw, createShapeId, type Editor } from "tldraw"

import {
  DatabaseShapeUtil,
  QueueShapeUtil,
  ServiceShapeUtil,
} from "@/components/canvas/shapes/shape-utils"

const shapeUtils = [ServiceShapeUtil, DatabaseShapeUtil, QueueShapeUtil]

function initializeCanvas(editor: Editor) {
  if (editor.getCurrentPageShapes().length > 0) return

  editor.createShapes([
    { id: createShapeId("starter-service"), type: "service", x: 0, y: 0, props: { label: "API server" } },
    { id: createShapeId("starter-database"), type: "database", x: 240, y: 0, props: { label: "PostgreSQL" } },
    { id: createShapeId("starter-queue"), type: "queue", x: 480, y: 0, props: { label: "Message queue" } },
  ])
  editor.zoomToFit({ animation: { duration: 0 } })
}

export function DiagramCanvas() {
  return (
    <div className="relative h-full min-w-0 flex-1">
      <Tldraw shapeUtils={shapeUtils} onMount={initializeCanvas} />
    </div>
  )
}
