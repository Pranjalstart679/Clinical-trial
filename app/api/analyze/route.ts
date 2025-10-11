export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get("image") as File | null
    if (!file) {
      return new Response(JSON.stringify({ error: "Image is required" }), { status: 400 })
    }

    // Simulate inference latency
    await new Promise((r) => setTimeout(r, 800))

    // Pseudo-deterministic hash from file metadata
    const basis = `${file.name}-${file.size}-${file.type}`
    const hash = Array.from(basis).reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 0)
    const stages = ["No DR", "Mild NPDR", "Moderate NPDR", "Severe NPDR", "PDR"] as const
    const stage = stages[hash % stages.length]

    const adviceMap: Record<(typeof stages)[number], string> = {
      "No DR": "No diabetic retinopathy detected. Recommend routine screening in 12 months.",
      "Mild NPDR": "Mild non-proliferative DR. Recommend follow-up in 6–12 months.",
      "Moderate NPDR": "Moderate non-proliferative DR. Refer to ophthalmology within 3 months.",
      "Severe NPDR": "Severe non-proliferative DR. Refer to ophthalmology within 2 weeks.",
      PDR: "Proliferative DR. Urgent referral to ophthalmology within 48 hours.",
    }

    // Confidence between 0.65 and 0.98, pseudo-random
    const confidence = 0.65 + ((hash % 1000) / 1000) * 0.33

    const body = {
      stage,
      confidence: Math.min(0.98, Math.max(0.65, Number(confidence.toFixed(3)))),
      advice: adviceMap[stage],
      timestamp: new Date().toISOString(),
    }

    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    console.error("[v0] analyze error", err)
    return new Response(JSON.stringify({ error: "Unexpected error" }), { status: 500 })
  }
}
