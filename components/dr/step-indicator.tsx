"use client"

import { cn } from "@/lib/utils"

type Step = {
  id: number
  label: string
}

export default function StepIndicator({
  steps,
  current,
}: {
  steps: Step[]
  current: number
}) {
  return (
    <nav aria-label="Progress" className="mb-6">
      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-5">
        {steps.map((s, idx) => {
          const isCurrent = idx === current
          const isCompleted = idx < current
          return (
            <li key={s.id} className="flex items-center gap-3">
              <span
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium",
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : isCurrent
                      ? "bg-accent text-accent-foreground"
                      : "bg-card text-muted-foreground",
                )}
              >
                {s.id}
              </span>
              <span
                className={cn(
                  "text-sm",
                  isCurrent ? "text-foreground font-medium" : isCompleted ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {s.label}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
