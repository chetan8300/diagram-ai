import { DIAGRAM_NODE_SIZE } from "@/components/canvas/layout"

export interface ServiceShapeProps {
  label?: string
}

/** SVG rendering shared by previews and the tldraw shape utility. */
export function ServiceShape({ label = "Service" }: ServiceShapeProps) {
  return (
    <svg
      role="img"
      aria-label={`Service: ${label}`}
      width={DIAGRAM_NODE_SIZE.width}
      height={DIAGRAM_NODE_SIZE.height}
      viewBox="0 0 160 80"
      className="text-foreground"
      style={{ width: "100%", height: "100%" }}
      preserveAspectRatio="none"
    >
      <rect x="1" y="1" width="158" height="78" rx="8" className="fill-card stroke-current" strokeWidth="2" />
      <text x="80" y="25" textAnchor="middle" className="fill-muted-foreground" fontSize="10" fontFamily="sans-serif">
        SERVICE
      </text>
      <foreignObject x="12" y="34" width="136" height="36">
        <div className="line-clamp-2 text-center font-sans text-sm leading-4 font-medium wrap-break-word">
          {label}
        </div>
      </foreignObject>
    </svg>
  )
}
