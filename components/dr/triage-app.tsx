"use client"

import { useMemo, useState } from "react"
import StepIndicator from "./step-indicator"
import PatientStep from "./patient-step"
import ImageUploader from "./image-uploader"
import ResultsPanel from "./results-panel"
import ReportSummary from "./report-summary"
import type { AnalysisResult, Patient } from "./types"

const steps = [
  { id: 1, label: "Patient" },
  { id: 2, label: "Upload" },
  { id: 3, label: "Results" },
  { id: 4, label: "Report" },
] as const

export default function ClientApp({ user }: { user?: { email: string } }) {
  // Patients
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>()

  // Image
  const [imageFile, setImageFile] = useState<File | undefined>()
  const imagePreviewUrl = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : undefined), [imageFile])

  // Result
  const [result, setResult] = useState<AnalysisResult | undefined>()
  const [analyzing, setAnalyzing] = useState(false)

  // Flow
  const [currentStep, setCurrentStep] = useState(0)

  function addPatient(p: Omit<Patient, "id">) {
    const id = crypto.randomUUID()
    const newP: Patient = { ...p, id }
    setPatients((prev) => [newP, ...prev])
    setSelectedPatientId(id)
  }

  function selectPatient(id: string) {
    setSelectedPatientId(id)
  }

  async function analyze() {
    if (!imageFile) return
    setAnalyzing(true)
    try {
      const fd = new FormData()
      fd.append("image", imageFile)
      if (selectedPatientId) fd.append("patientId", selectedPatientId)

      const res = await fetch("/api/analyze", { method: "POST", body: fd })
      if (!res.ok) throw new Error("Analysis failed")
      const data = (await res.json()) as AnalysisResult
      setResult(data)
      setCurrentStep(2)
    } catch (err) {
      console.error("[v0] Analysis error:", (err as Error).message)
      alert("Analysis failed. Please try again.")
    } finally {
      setAnalyzing(false)
    }
  }

  const selectedPatient = useMemo(() => patients.find((p) => p.id === selectedPatientId), [patients, selectedPatientId])

  return (
    <div>
      <StepIndicator steps={steps as any} current={currentStep} />

      {/* Step 1: Patient */}
      {currentStep === 0 && (
        <PatientStep
          patients={patients}
          selectedPatientId={selectedPatientId}
          onSelectPatient={selectPatient}
          onAddPatient={addPatient}
          onContinue={() => setCurrentStep(1)}
          requireSignIn={!user} // disable continue until signed in
        />
      )}

      {/* Step 2: Upload */}
      {currentStep === 1 && (
        <div className="max-w-3xl">
          <ImageUploader
            onSelected={(file) => {
              setImageFile(file)
              setResult(undefined)
            }}
            onAnalyze={analyze}
            disabled={!user || !imageFile || !selectedPatientId || analyzing} // require sign-in
            imagePreviewUrl={imagePreviewUrl}
          />
          {!user && (
            <p className="mt-3 text-xs text-muted-foreground">
              Please sign in first using the button at the top right.
            </p>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Ensure images are de-identified before upload in production. This demo does not store images on a server.
          </p>
        </div>
      )}

      {/* Step 3: Results */}
      {currentStep === 2 && (
        <div className="max-w-5xl">
          <ResultsPanel
            result={result}
            patient={selectedPatient}
            imagePreviewUrl={imagePreviewUrl}
            analyzing={analyzing}
            onGenerateReport={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        </div>
      )}

      {/* Step 4: Report */}
      {currentStep === 3 && (
        <div className="max-w-4xl">
          <ReportSummary
            patient={selectedPatient}
            result={result}
            clinicianEmail={user?.email}
            imagePreviewUrl={imagePreviewUrl}
            onBackToResults={() => setCurrentStep(2)}
          />
        </div>
      )}
    </div>
  )
}
