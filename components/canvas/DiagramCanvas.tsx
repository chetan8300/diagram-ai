"use client"

import { useCallback } from "react"
import { Tldraw, type Editor } from "tldraw"

import {
  DatabaseShapeUtil,
  QueueShapeUtil,
  ServiceShapeUtil,
} from "@/components/canvas/shapes/shape-utils"

const shapeUtils = [ServiceShapeUtil, DatabaseShapeUtil, QueueShapeUtil]

export function DiagramCanvas({ onReady }: { onReady: (editor: Editor | null) => void }) {
  const initializeCanvas = useCallback((editor: Editor) => {
    onReady(editor)
    return () => { onReady(null) }
  }, [onReady])

  return (
    <div className="relative h-full min-w-0 flex-1">
      <Tldraw shapeUtils={shapeUtils} onMount={initializeCanvas} />
    </div>
  )
}
