import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import os from "os"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  // Dynamically import pdf-parse (CommonJS)
  const pdfParse = (await import("pdf-parse")).default

  // Parse the incoming form data
  const formData = await req.formData()
  const file = formData.get("resume") as File

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
  }

  // Save the file temporarily
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const os = require("os") // put at top of the file
  const tempFilePath = path.join(os.tmpdir(), `${Date.now()}-${file.name}`)

  await fs.writeFile(tempFilePath, buffer)

  try {
    // Use pdf-parse to extract text
    const data = await pdfParse(buffer)
    console.log("pdf-parse data:", data)
    await fs.unlink(tempFilePath)
    return NextResponse.json({ text: data.text })
  } catch (error: any) {
    await fs.unlink(tempFilePath)
    return NextResponse.json({ error: error?.toString() || "Failed to parse PDF" }, { status: 500 })
  }
} 