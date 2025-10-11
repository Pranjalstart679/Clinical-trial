"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import ClientApp from "@/components/dr/triage-app"

export default function TriageShell() {
  const [user, setUser] = useState<{ email: string } | undefined>()
  const [open, setOpen] = useState(false)

  const initials = useMemo(() => (user?.email ? user.email[0]?.toUpperCase() : ""), [user])

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/placeholder-logo.svg" alt="Clinic logo" width={28} height={28} className="rounded-sm" priority />
          <div>
            <h1 className="text-balance text-xl font-semibold tracking-tight">Diabetic Retinopathy Triage</h1>
            <p className="text-sm text-muted-foreground">HIPAA-aligned, clinic-friendly workflow</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div
                aria-label="Signed-in clinician"
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5"
              >
                <span className="inline-flex size-6 items-center justify-center rounded-full bg-secondary text-sm font-medium">
                  {initials}
                </span>
                <span className="text-sm">{user.email}</span>
              </div>
              <Button variant="secondary" onClick={() => setUser(undefined)}>
                Sign out
              </Button>
            </>
          ) : (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="min-w-28">
                  Sign in
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Sign in to continue</DialogTitle>
                </DialogHeader>
                {/* Reuse existing login form */}
                {/* @ts-expect-error server/edge boundary typing */}
                <LoginPortal
                  onSuccess={(u) => {
                    setUser(u)
                    setOpen(false)
                  }}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </header>

      <section aria-label="Overview" className="rounded-lg border bg-card/50 p-5 md:p-6">
        <div className="grid items-start gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-pretty text-lg font-medium md:text-xl">
              A simple, safe way to screen for diabetic retinopathy
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>• Select or create a patient profile in seconds.</li>
              <li>• Upload a fundus image and get a stage with confidence.</li>
              <li>• Receive clear clinical advice and generate a printable summary.</li>
            </ul>
          </div>
          <div className="rounded-md border bg-background p-4">
            <img
              src="/calm-clinical-dashboard-preview.jpg"
              alt="Clinical interface preview"
              className="mx-auto h-40 w-auto md:h-48"
            />
          </div>
        </div>
      </section>

      <section aria-label="Workflow">
        <ClientApp user={user} />
      </section>
    </div>
  )
}

function LoginPortal({ onSuccess }: { onSuccess: (u: { email: string }) => void }) {
  // Lazy import to avoid server type issues; bundlers handle this as client
  const LoginCard = require("./login-card").default
  return <LoginCard onSuccess={onSuccess} />
}
