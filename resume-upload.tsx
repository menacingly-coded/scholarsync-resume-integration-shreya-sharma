"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Loader2, AlertCircle, User, Mail, Phone, GraduationCap, Briefcase, Code } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ParsedResume {
  name: string
  email: string
  phone: string
  skills: string[]
  education: Array<{
    degree: string
    institution: string
    year: string
  }>
  experience: Array<{
    title: string
    company: string
    duration: string
    description: string
  }>
}

export default function Component() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [parsedData, setParsedData] = useState<ParsedResume | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file type
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
      ]

      if (!allowedTypes.includes(file.type)) {
        setError("Please upload a PDF or DOCX file only.")
        setSelectedFile(null)
        setParsedData(null)
        return
      }

      setError("")
      setSelectedFile(file)
      setParsedData(null)
    }
  }

  const handleUploadAndParse = async () => {
    if (!selectedFile) return

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call to parse resume
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Mock parsed data - in real implementation, this would come from your parsing service
      const mockParsedData: ParsedResume = {
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        phone: "+1 (555) 123-4567",
        skills: ["JavaScript", "React", "Node.js", "Python", "SQL", "AWS", "Docker", "Git"],
        education: [
          {
            degree: "Master of Science in Computer Science",
            institution: "Stanford University",
            year: "2020",
          },
          {
            degree: "Bachelor of Science in Software Engineering",
            institution: "UC Berkeley",
            year: "2018",
          },
        ],
        experience: [
          {
            title: "Senior Software Engineer",
            company: "Tech Corp",
            duration: "2021 - Present",
            description:
              "Led development of scalable web applications using React and Node.js. Managed a team of 5 developers and improved system performance by 40%.",
          },
          {
            title: "Software Engineer",
            company: "StartupXYZ",
            duration: "2020 - 2021",
            description:
              "Developed full-stack applications using modern JavaScript frameworks. Implemented CI/CD pipelines and automated testing procedures.",
          },
        ],
      }

      setParsedData(mockParsedData)
    } catch (err) {
      setError("Failed to parse resume. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Resume Parser</h1>
        <p className="text-muted-foreground">Upload your resume and extract key information automatically</p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Resume
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resume-file">Select Resume File</Label>
            <Input
              id="resume-file"
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            <p className="text-sm text-muted-foreground">Supported formats: PDF, DOCX</p>
          </div>

          {selectedFile && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
              <span className="text-sm text-muted-foreground">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button onClick={handleUploadAndParse} disabled={!selectedFile || isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Parsing Resume...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload & Parse
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Parsed Information Display */}
      {parsedData && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Extracted Information</h2>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm">{parsedData.name}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Email
                  </Label>
                  <p className="text-sm">{parsedData.email}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Phone
                  </Label>
                  <p className="text-sm">{parsedData.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {parsedData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {parsedData.education.map((edu, index) => (
                <div key={index} className="space-y-1">
                  <h4 className="font-medium">{edu.degree}</h4>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  <p className="text-sm text-muted-foreground">Graduated: {edu.year}</p>
                  {index < parsedData.education.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Work Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {parsedData.experience.map((exp, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <h4 className="font-medium">{exp.title}</h4>
                    <Badge variant="outline">{exp.duration}</Badge>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">{exp.company}</p>
                  <p className="text-sm">{exp.description}</p>
                  {index < parsedData.experience.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
