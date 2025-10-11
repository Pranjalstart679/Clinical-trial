"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function LoginCard({ onSuccess }: { onSuccess: (user: { email: string }) => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Simulate authentication latency
    await new Promise((r) => setTimeout(r, 450))
    onSuccess({ email })
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Login</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="clinician@clinic.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            This demo simulates a secure, HIPAA-aligned workflow. Do not enter real PHI or credentials.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button type="submit" disabled={loading} className="min-w-28">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
