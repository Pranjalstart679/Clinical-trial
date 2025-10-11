export type Patient = {
  id: string
  firstName: string
  lastName: string
  dob?: string
  mrn?: string
}

export type AnalysisResult = {
  stage: "No DR" | "Mild NPDR" | "Moderate NPDR" | "Severe NPDR" | "PDR"
  confidence: number // 0..1
  advice: string
  timestamp: string
}
