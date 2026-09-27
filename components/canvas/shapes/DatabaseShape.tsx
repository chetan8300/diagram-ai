import { DIAGRAM_NODE_SIZE } from "@/components/canvas/layout"

export interface DatabaseShapeProps {
  label?: string
}

/** SVG rendering shared by previews and the tldraw shape utility. */
export function DatabaseShape({ label = "Database" }: DatabaseShapeProps) {
  return (
    <svg
      role="img"
      aria-label={`Database: ${label}`}
      width={DIAGRAM_NODE_SIZE.width}
      height={DIAGRAM_NODE_SIZE.height}
      viewBox="0 0 160 80"
      className="text-foreground"
      style={{ width: "100%", height: "100%" }}
      preserveAspectRatio="none"
    >
      <path d="M 1 13 A 79 12 0 0 1 159 13 V 67 A 79 12 0 0 1 1 67 Z" className="fill-card stroke-current" strokeWidth="2" />
      <ellipse cx="80" cy="13" rx="79" ry="12" className="fill-muted stroke-current" strokeWidth="2" />
      <foreignObject x="12" y="35" width="136" height="32">
        <div className="line-clamp-2 text-center font-sans text-sm leading-4 font-medium wrap-break-word">
          {label}
        </div>
      </foreignObject>
    </svg>
  )
}
