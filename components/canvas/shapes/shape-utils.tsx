import { BaseBoxShapeUtil, HTMLContainer, T, type TLShape } from "tldraw"

import { DIAGRAM_NODE_SIZE } from "@/components/canvas/layout"
import { DatabaseShape } from "./DatabaseShape"
import { QueueShape } from "./QueueShape"
import { ServiceShape } from "./ServiceShape"

type DiagramShapeProps = { w: number; h: number; label: string }

declare module "tldraw" {
  interface TLGlobalShapePropsMap {
    service: DiagramShapeProps
    database: DiagramShapeProps
    queue: DiagramShapeProps
  }
}

type DiagramShape = TLShape<"service" | "database" | "queue">

const shapeComponents = {
  service: ServiceShape,
  database: DatabaseShape,
  queue: QueueShape,
}

abstract class DiagramShapeUtil extends BaseBoxShapeUtil<DiagramShape> {
  static override props = { w: T.positiveNumber, h: T.positiveNumber, label: T.string }

  override getDefaultProps(): DiagramShapeProps {
    return { w: DIAGRAM_NODE_SIZE.width, h: DIAGRAM_NODE_SIZE.height, label: "Diagram node" }
  }

  override component(shape: DiagramShape) {
    const Component = shapeComponents[shape.type]
    return (
      <HTMLContainer style={{ width: shape.props.w, height: shape.props.h }}>
        <Component label={shape.props.label} />
      </HTMLContainer>
    )
  }

  override getIndicatorPath(shape: DiagramShape) {
    const path = new Path2D()
    path.rect(0, 0, shape.props.w, shape.props.h)
    return path
  }
}

export class ServiceShapeUtil extends DiagramShapeUtil {
  static override type = "service" as const
  override getDefaultProps() {
    return { ...super.getDefaultProps(), label: "Service" }
  }
}

export class DatabaseShapeUtil extends DiagramShapeUtil {
  static override type = "database" as const
  override getDefaultProps() {
    return { ...super.getDefaultProps(), label: "Database" }
  }
}

export class QueueShapeUtil extends DiagramShapeUtil {
  static override type = "queue" as const
  override getDefaultProps() {
    return { ...super.getDefaultProps(), label: "Queue" }
  }
}
