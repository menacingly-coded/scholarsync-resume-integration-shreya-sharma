"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Loader2, AlertCircle, User, Search, BookOpen } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import RecommendedProjects from "./recommended-projects"

// Resume interfaces
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

// Scholar interfaces
interface Publication {
  title: string
  authors: string[]
  venue: string
  year: number
  citations: number
  url?: string
}

interface ScholarData {
  name: string
  affiliation: string
  email?: string
  profileImage?: string
  interests: string[]
  metrics: {
    totalCitations: number
    hIndex: number
    i10Index: number
    citationsSince2019: number
  }
  publications: Publication[]
  verified: boolean
}

export default function Component() {
  // Resume state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isResumeLoading, setIsResumeLoading] = useState(false)
  const [resumeError, setResumeError] = useState<string>("")
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null)

  // Scholar state
  const [scholarUrl, setScholarUrl] = useState("")
  const [isScholarLoading, setIsScholarLoading] = useState(false)
  const [scholarError, setScholarError] = useState("")
  const [scholarData, setScholarData] = useState<ScholarData | null>(null)

  // Resume handlers
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
      ]

      if (!allowedTypes.includes(file.type)) {
        setResumeError("Please upload a PDF or DOCX file only.")
        setSelectedFile(null)
        setParsedResume(null)
        return
      }

      setResumeError("")
      setSelectedFile(file)
      setParsedResume(null)
    }
  }

  const handleUploadAndParse = async () => {
    if (!selectedFile) return

    setIsResumeLoading(true)
    setResumeError("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))

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

      setParsedResume(mockParsedData)
    } catch (err) {
      setResumeError("Failed to parse resume. Please try again.")
    } finally {
      setIsResumeLoading(false)
    }
  }

  // Scholar handlers
  const validateGoogleScholarUrl = (url: string): boolean => {
    const scholarUrlPattern = /^https:\/\/scholar\.google\.[a-z.]+\/citations\?user=[\w-]+/
    return scholarUrlPattern.test(url)
  }

  const handleFetchScholarData = async () => {
    if (!scholarUrl.trim()) {
      setScholarError("Please enter a Google Scholar profile URL")
      return
    }

    if (!validateGoogleScholarUrl(scholarUrl)) {
      setScholarError("Please enter a valid Google Scholar profile URL")
      return
    }

    setIsScholarLoading(true)
    setScholarError("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 2500))

      const mockScholarData: ScholarData = {
        name: "Dr. Sarah Chen",
        affiliation: "Professor of Computer Science, Stanford University",
        email: "sarah.chen@stanford.edu",
        profileImage: "/placeholder.svg?height=100&width=100",
        interests: [
          "Machine Learning",
          "Natural Language Processing",
          "Computer Vision",
          "Artificial Intelligence",
          "Deep Learning",
          "Neural Networks",
        ],
        metrics: {
          totalCitations: 15420,
          hIndex: 42,
          i10Index: 89,
          citationsSince2019: 8750,
        },
        publications: [
          {
            title: "Attention Is All You Need: A Comprehensive Survey of Transformer Architectures",
            authors: ["S Chen", "M Johnson", "R Williams", "A Kumar"],
            venue: "Nature Machine Intelligence",
            year: 2023,
            citations: 1250,
            url: "#",
          },
          {
            title: "Deep Learning for Natural Language Understanding: Recent Advances and Future Directions",
            authors: ["S Chen", "L Zhang", "P Anderson"],
            venue: "Journal of Artificial Intelligence Research",
            year: 2022,
            citations: 890,
            url: "#",
          },
        ],
        verified: true,
      }

      setScholarData(mockScholarData)
    } catch (err) {
      setScholarError("Failed to fetch scholar data. Please check the URL and try again.")
    } finally {
      setIsScholarLoading(false)
    }
  }

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScholarUrl(event.target.value)
    if (scholarError) setScholarError("")
  }

  const showRecommendations = parsedResume && scholarData

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4 mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl blur-3xl opacity-20"></div>
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text">
            <h1 className="text-5xl font-bold text-transparent">ScholarSync</h1>
          </div>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Upload your resume and Scholar profile to get personalized project recommendations
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resume Upload Section */}
        <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50">
            <CardTitle className="flex items-center gap-2 text-blue-700">
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
              </div>
            )}

            {resumeError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{resumeError}</AlertDescription>
              </Alert>
            )}

            <Button onClick={handleUploadAndParse} disabled={!selectedFile || isResumeLoading} className="w-full">
              {isResumeLoading ? (
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

            {parsedResume && (
              <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Resume parsed successfully!</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scholar URL Section */}
        <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Search className="h-5 w-5" />
              Scholar Profile URL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scholar-url">Google Scholar Profile URL</Label>
              <Input
                id="scholar-url"
                type="url"
                placeholder="https://scholar.google.com/citations?user=..."
                value={scholarUrl}
                onChange={handleUrlChange}
                className="font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                Example: https://scholar.google.com/citations?user=ABC123DEF
              </p>
            </div>

            {scholarError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{scholarError}</AlertDescription>
              </Alert>
            )}

            <Button onClick={handleFetchScholarData} disabled={isScholarLoading} className="w-full">
              {isScholarLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching Scholar Data...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Fetch Scholar Data
                </>
              )}
            </Button>

            {scholarData && (
              <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm font-medium">Scholar data fetched successfully!</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommended Projects Section */}
      {showRecommendations && (
        <RecommendedProjects
          resumeSkills={parsedResume.skills}
          scholarInterests={scholarData.interests}
          onRefresh={() => {
            console.log("Refreshing recommendations...")
          }}
        />
      )}

      {/* Status message when waiting for both data sources */}
      {(parsedResume || scholarData) && !showRecommendations && (
        <Card className="border-dashed border-2 border-indigo-300 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
          <CardContent className="text-center py-8">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-indigo-700">Almost Ready!</h3>
              <p className="text-indigo-600">
                {!parsedResume && "Upload your resume and "}
                {!scholarData && "add your Scholar profile "}
                to get personalized project recommendations.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
