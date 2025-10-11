"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { AnalysisResult, Patient } from "./types"

export default function ResultsPanel({
  result,
  patient,
  imagePreviewUrl,
  onGenerateReport,
  onBack,
  analyzing,
}: {
  result?: AnalysisResult
  patient?: Patient
  imagePreviewUrl?: string
  onGenerateReport: () => void
  onBack: () => void
  analyzing?: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Analysis Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {analyzing ? (
          <div className="text-muted-foreground">Analyzing image...</div>
        ) : result ? (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <figure className="rounded-md border p-3">
                <img
                  src={imagePreviewUrl || "/placeholder.svg?height=256&width=384&query=Fundus%20image%20placeholder"}
                  alt="Analyzed fundus image preview"
                  className="mx-auto h-64 w-auto rounded"
                />
              </figure>

              <div className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Predicted Stage</div>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="secondary">{result.stage}</Badge>
                    <span className="text-sm text-muted-foreground">
                      Confidence: {(result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">Clinical Recommendation</div>
                  <p className="mt-1 text-sm leading-relaxed">{result.advice}</p>
                </div>

                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">Patient</div>
                  <div className="mt-1 text-sm">
                    {patient
                      ? `${patient.lastName}, ${patient.firstName} • DOB ${patient.dob || "—"} • MRN ${patient.mrn || "—"}`
                      : "—"}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">Timestamp: {result.timestamp}</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No results yet. Upload and analyze an image.</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onGenerateReport} disabled={!result}>
          Generate Report
        </Button>
      </CardFooter>
    </Card>
  )
}
