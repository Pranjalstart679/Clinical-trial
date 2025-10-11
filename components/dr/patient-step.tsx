"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import type { Patient } from "./types"

export default function PatientStep({
  patients,
  onAddPatient,
  onSelectPatient,
  selectedPatientId,
  onContinue,
  requireSignIn, // new prop
}: {
  patients: Patient[]
  onAddPatient: (p: Omit<Patient, "id">) => void
  onSelectPatient: (id: string) => void
  selectedPatientId?: string
  onContinue: () => void
  requireSignIn?: boolean // new prop
}) {
  const [mode, setMode] = useState<"existing" | "new">("existing")
  const [form, setForm] = useState<Omit<Patient, "id">>({
    firstName: "",
    lastName: "",
    dob: "",
    mrn: "",
  })

  const fullPatients = useMemo(
    () =>
      patients.map((p) => ({
        ...p,
        fullName: `${p.lastName}, ${p.firstName}`,
      })),
    [patients],
  )

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="order-2 md:order-1">
        <CardHeader>
          <CardTitle className="text-lg">Select Patient</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Button variant={mode === "existing" ? "default" : "secondary"} onClick={() => setMode("existing")}>
              Existing
            </Button>
            <Button variant={mode === "new" ? "default" : "secondary"} onClick={() => setMode("new")}>
              New
            </Button>
          </div>

          <Separator />

          {mode === "existing" ? (
            <div className="space-y-2">
              {fullPatients.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No patients yet. Add a new patient in the pane on the right.
                </p>
              ) : (
                <ul className="divide-y">
                  {fullPatients.map((p) => (
                    <li key={p.id} className="flex items-center justify-between py-3">
                      <div className="text-sm">
                        <div className="font-medium">{p.fullName}</div>
                        <div className="text-muted-foreground">
                          DOB: {p.dob || "—"} · MRN: {p.mrn || "—"}
                        </div>
                      </div>
                      <Button
                        variant={selectedPatientId === p.id ? "default" : "outline"}
                        onClick={() => onSelectPatient(p.id)}
                      >
                        {selectedPatientId === p.id ? "Selected" : "Select"}
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Use the form on the right to add a new patient.</p>
          )}
        </CardContent>
        <CardFooter className="justify-end">
          {requireSignIn && (
            <p className="text-xs text-muted-foreground">
              Please sign in using the button at the top right to proceed.
            </p>
          )}
          <Button onClick={onContinue} disabled={!selectedPatientId || !!requireSignIn}>
            Continue
          </Button>
        </CardFooter>
      </Card>

      <Card className="order-1 md:order-2">
        <CardHeader>
          <CardTitle className="text-lg">Add New Patient</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                placeholder="Jane"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                placeholder="Doe"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dob">Date of birth</Label>
              <Input
                id="dob"
                type="date"
                value={form.dob}
                onChange={(e) => setForm((f) => ({ ...f, dob: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mrn">MRN</Label>
              <Input
                id="mrn"
                value={form.mrn}
                onChange={(e) => setForm((f) => ({ ...f, mrn: e.target.value }))}
                placeholder="Medical Record Number"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <Button
            variant="secondary"
            onClick={() =>
              setForm({
                firstName: "",
                lastName: "",
                dob: "",
                mrn: "",
              })
            }
          >
            Clear
          </Button>
          <Button
            onClick={() => {
              if (!form.firstName || !form.lastName) return
              onAddPatient(form)
              setForm({ firstName: "", lastName: "", dob: "", mrn: "" })
            }}
            disabled={!form.firstName || !form.lastName}
          >
            Add Patient
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
