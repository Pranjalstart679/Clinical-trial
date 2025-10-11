"use client"

import { useRef, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ImageUploader({
  onSelected,
  onAnalyze,
  disabled,
  imagePreviewUrl,
}: {
  onSelected: (file: File | undefined) => void
  onAnalyze: () => void
  disabled?: boolean
  imagePreviewUrl?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upload Fundus Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={[
            "flex cursor-pointer flex-col items-center justify-center rounded-md border p-6 text-center",
            dragOver ? "bg-accent" : "bg-card",
          ].join(" ")}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            const file = e.dataTransfer.files?.[0]
            if (file) onSelected(file)
          }}
          onClick={() => inputRef.current?.click()}
          role="button"
          aria-label="Upload fundus image"
        >
          <p className="text-sm">Drag and drop a fundus image here, or click to select</p>
          <p className="text-xs text-muted-foreground mt-1">Accepted formats: JPG, PNG. Max ~10MB</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0]
              onSelected(file)
            }}
          />
        </div>

        {imagePreviewUrl ? (
          <figure className="rounded-md border p-3">
            <img
              src={imagePreviewUrl || "/placeholder.svg"}
              alt="Selected fundus image preview"
              className="mx-auto h-64 w-auto rounded"
            />
            <figcaption className="mt-2 text-center text-xs text-muted-foreground">
              Preview of the uploaded fundus image
            </figcaption>
          </figure>
        ) : (
          <div className="rounded-md border p-3">
            <img
              src="/fundus-image-placeholder.jpg"
              alt="Placeholder for fundus image"
              className="mx-auto h-64 w-auto rounded"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={onAnalyze} disabled={disabled}>
          Analyze Image
        </Button>
      </CardFooter>
    </Card>
  )
}
