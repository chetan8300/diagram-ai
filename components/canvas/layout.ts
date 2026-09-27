/** Shared node dimensions for shape previews and future auto-layout. */
export const DIAGRAM_NODE_SIZE = { width: 160, height: 80 } as const

/** ELK configuration only. Graph layout is not connected yet. */
export const DIAGRAM_LAYOUT_OPTIONS = {
  "elk.algorithm": "layered",
  "elk.direction": "RIGHT",
  "elk.spacing.nodeNode": "60",
  "elk.layered.spacing.nodeNodeBetweenLayers": "80",
} as const
