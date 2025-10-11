"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { AnalysisResult, Patient } from "./types"

export default function ReportSummary({
  patient,
  result,
  clinicianEmail,
  imagePreviewUrl,
  onBackToResults,
}: {
  patient?: Patient
  result?: AnalysisResult
  clinicianEmail?: string
  imagePreviewUrl?: string
  onBackToResults: () => void
}) {
  function handlePrint() {
    window.print()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Report Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <section className="rounded-md border p-4 print:border-0">
          <h2 className="text-base font-medium">Patient Information</h2>
          <div className="mt-2 text-sm">
            {patient ? (
              <>
                <div>
                  Name: {patient.lastName}, {patient.firstName}
                </div>
                <div>DOB: {patient.dob || "—"}</div>
                <div>MRN: {patient.mrn || "—"}</div>
              </>
            ) : (
              <div>—</div>
            )}
          </div>
        </section>

        <section className="rounded-md border p-4 print:border-0">
          <h2 className="text-base font-medium">Findings</h2>
          <div className="mt-2 text-sm">
            {result ? (
              <>
                <div>Predicted Stage: {result.stage}</div>
                <div>Confidence: {(result.confidence * 100).toFixed(1)}%</div>
                <div>Recommendation: {result.advice}</div>
                <div>Timestamp: {result.timestamp}</div>
              </>
            ) : (
              <div>—</div>
            )}
          </div>
        </section>

        <section className="rounded-md border p-4 print:border-0">
          <h2 className="text-base font-medium">Image</h2>
          <div className="mt-2 rounded border p-3">
            <img
              src={imagePreviewUrl || "/placeholder.svg?height=256&width=384&query=Fundus%20image%20placeholder"}
              alt="Fundus image included in the report"
              className="mx-auto h-64 w-auto rounded"
            />
          </div>
        </section>

        <p className="text-xs text-muted-foreground">
          Prepared by: {clinicianEmail || "—"} • This report is for clinical decision support and does not replace
          clinical judgment.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between print:hidden">
        <Button variant="secondary" onClick={onBackToResults}>
          Back to Results
        </Button>
        <Button onClick={handlePrint}>Print / Save PDF</Button>
      </CardFooter>
    </Card>
  )
}
