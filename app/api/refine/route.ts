// Refinement will be connected after the generation workflow.
export async function POST() {
  return Response.json({ error: "Diagram refinement is not available yet." }, { status: 501 })
}
