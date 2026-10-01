"use client"

import { useCallback, useRef, useState } from "react"
import { type Editor } from "tldraw"

import { DiagramCanvas } from "@/components/canvas/DiagramCanvas"
import { ChatSidebar } from "@/components/chat/ChatSidebar"
import { Separator } from "@/components/ui/separator"
import { layoutDiagram } from "@/components/canvas/layout"
import { DiagramSchema, type Diagram } from "@/lib/ai/schemas"
import { replaceDiagramOnCanvas } from "@/lib/diagram/tldraw-mapper"
import "tldraw/tldraw.css"

export default function HomePage() {
  const [editor, setEditor] = useState<Editor | null>(null)
  const currentEditor = useRef<Editor | null>(null)
  const requestController = useRef<AbortController | null>(null)

  const onReady = useCallback((nextEditor: Editor | null) => {
    currentEditor.current = nextEditor
    setEditor(nextEditor)
    if (!nextEditor) requestController.current?.abort()
  }, [])

  const generate = useCallback(async (prompt: string): Promise<Diagram> => {
    if (!editor || currentEditor.current !== editor) throw new Error("The canvas is still loading. Please try again.")
    if (requestController.current) throw new Error("A diagram is already being generated.")
    const controller = new AbortController()
    requestController.current = controller
    const pageId = editor.getCurrentPageId()
    const originalDocument = JSON.stringify(editor.store.getStoreSnapshot("document"))
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(90_000)]),
      })
      const body: unknown = await response.json()
      if (!response.ok) {
        const error = body && typeof body === "object" && "error" in body ? body.error : null
        throw new Error(typeof error === "string" ? error : "Generation failed. Please try again.")
      }
      const diagram = DiagramSchema.parse(body)
      const laidOut = await layoutDiagram(diagram)
      if (controller.signal.aborted || currentEditor.current !== editor) throw new Error("Generation was cancelled.")
      if (JSON.stringify(editor.store.getStoreSnapshot("document")) !== originalDocument || editor.getCurrentPageId() !== pageId) {
        throw new Error("The canvas changed during generation. Your edits were kept. Retry when you are ready to replace the diagram.")
      }
      replaceDiagramOnCanvas(editor, laidOut)
      editor.zoomToFit({ animation: { duration: 0 } })
      return diagram
    } finally {
      requestController.current = null
    }
  }, [editor])

  return (
    <div className="editor flex h-full w-full">
      <DiagramCanvas onReady={onReady} />
      <Separator orientation="vertical" className="h-full" />
      <ChatSidebar onGenerate={generate} canvasReady={editor !== null} />
    </div>
  )
}
