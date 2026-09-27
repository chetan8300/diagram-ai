import { DIAGRAM_NODE_SIZE } from "@/components/canvas/layout"

export interface QueueShapeProps {
  label?: string
}

/** SVG rendering shared by previews and the tldraw shape utility. */
export function QueueShape({ label = "Queue" }: QueueShapeProps) {
  return (
    <svg
      role="img"
      aria-label={`Queue: ${label}`}
      width={DIAGRAM_NODE_SIZE.width}
      height={DIAGRAM_NODE_SIZE.height}
      viewBox="0 0 160 80"
      className="text-foreground"
      style={{ width: "100%", height: "100%" }}
      preserveAspectRatio="none"
    >
      <rect x="1" y="1" width="158" height="78" rx="4" className="fill-card stroke-current" strokeWidth="2" />
      <path d="M 16 15 H 42 V 29 H 16 Z M 48 15 H 74 V 29 H 48 Z M 80 15 H 106 V 29 H 80 Z" className="fill-muted stroke-current" />
      <path d="M 116 22 H 143 M 137 16 L 143 22 L 137 28" fill="none" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <foreignObject x="12" y="42" width="136" height="32">
        <div className="line-clamp-2 text-center font-sans text-sm leading-4 font-medium wrap-break-word">
          {label}
        </div>
      </foreignObject>
    </svg>
  )
}
