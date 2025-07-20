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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Code } from "lucide-react"
import { useEffect } from "react"

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
  rawText?: string // Added for raw extracted text
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

  // Add state for filtered skills
  const [filteredSkills, setFilteredSkills] = useState<string[]>([])

  // Helper: Extract info from raw text
  function extractInfoFromText(text: string) {
    // Simple regex-based extraction
    let name = ""
    const nameMatch = text.match(/Name[:\s]+([A-Z][a-z]+(?: [A-Z][a-z]+)+)/)
    if (nameMatch) {
      name = nameMatch[1]
    } else {
      // Fallback: first non-empty line is likely the name
      const lines = text.split(/\n|\r/).map(l => l.trim()).filter(Boolean)
      if (lines.length > 0) {
        name = lines[0]
      }
    }
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.[A-Za-z]{2,}/)
    // Improved phone extraction: first look for 'Mobile:' and extract the number after it
    let phone = ""
    const mobileMatch = text.match(/Mobile\s*[:\-]?\s*([+\d][\d\s\-().]{7,}\d)/i)
    if (mobileMatch) {
      phone = mobileMatch[1].trim()
    } else {
      const phoneMatch = text.match(/(\+?\d[\d\s\-().]{7,}\d)/)
      if (phoneMatch) phone = phoneMatch[1].trim()
    }

    // Improved skill extraction: find any section header containing 'Skill'
    let skills: string[] = []
    const skillSectionMatch = text.match(/([A-Z ]*Skill[s]?[^\n]*)([\s\S]*?)(?=\n\s*[A-Z][A-Z ]{2,}|$)/i)
    if (skillSectionMatch) {
      const skillSection = skillSectionMatch[2]
      const lines = skillSection.split(/\n|\r/)
      for (const line of lines) {
        // Look for lines like 'Languages: ...', 'Tech Stack: ...', etc.
        const colonIdx = line.indexOf(":")
        if (colonIdx !== -1) {
          const afterColon = line.slice(colonIdx + 1)
          skills = skills.concat(afterColon.split(/,|\s{2,}/).map(s => s.trim()).filter(Boolean))
        }
      }
    }
    // Remove duplicates and normalize
    skills = [...new Set(skills.map(s => s.replace(/\s+/g, ' ').trim()))]

    return {
      name,
      email: emailMatch ? emailMatch[0] : "",
      phone,
      skills,
    }
  }

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
      if (selectedFile.type === "application/pdf") {
        const formData = new FormData()
        formData.append("resume", selectedFile)
        const response = await fetch("/api/parse-resume", {
          method: "POST",
          body: formData,
        })
        if (!response.ok) throw new Error("Failed to parse resume")
        const data = await response.json()
        const info = extractInfoFromText(data.text || "")
        setParsedResume({
          name: info.name,
          email: info.email,
          phone: info.phone,
          skills: info.skills,
          education: [],
          experience: [],
          rawText: data.text, // Store raw text
        })
        console.log("Parsed Resume Info:", info)
      } else {
        // Keep mock data for DOCX for now
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
          rawText: "Mock resume text for DOCX parsing.", // Mock raw text
        }
        setParsedResume(mockParsedData)
        console.log("Parsed Resume Data:", mockParsedData)
      }
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

  // After fetching recommended projects, filter skills
  useEffect(() => {
    if (parsedResume && parsedResume.skills.length > 0) {
      // Fetch recommended projects to get matchingTags
      const fetchAndFilter = async () => {
        const res = await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ skills: parsedResume.skills, interests: scholarData?.interests || [] }),
        })
        if (!res.ok) return
        const data = await res.json()
        const allTags = new Set<string>()
        for (const proj of data.projects || []) {
          for (const tag of proj.matchingTags || []) {
            allTags.add(tag.toLowerCase())
          }
        }
        // Only show skills that match any tag
        setFilteredSkills(parsedResume.skills.filter(skill => allTags.has(skill.toLowerCase())))
      }
      fetchAndFilter()
    } else {
      setFilteredSkills([])
    }
  }, [parsedResume, scholarData])

  return (
    <div className="max-w-full mx-auto p-4 sm:p-8 space-y-10">
      <div className="text-center space-y-4 mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-2xl blur-2xl opacity-15"></div>
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text">
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent tracking-tight">ScholarSync</h1>
          </div>
        </div>
        <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
          Upload your resume and Scholar profile to get personalized project recommendations
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Resume Upload Section */}
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-2xl">
          <CardHeader className="bg-white rounded-t-2xl pb-2">
            <CardTitle className="flex items-center gap-2 text-blue-700 text-base font-semibold">
              <Upload className="h-4 w-4" />
              Upload Resume
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="resume-file" className="text-xs font-medium">Select Resume File</Label>
              <Input
                id="resume-file"
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                className="cursor-pointer text-xs px-2 py-1 rounded border border-gray-200 focus:ring-2 focus:ring-blue-100"
              />
              <p className="text-xs text-muted-foreground">Supported formats: PDF, DOCX</p>
            </div>
            {selectedFile && (
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <FileText className="h-3 w-3 text-blue-400" />
                <span className="text-xs font-medium text-gray-700">{selectedFile.name}</span>
              </div>
            )}
            {resumeError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{resumeError}</AlertDescription>
              </Alert>
            )}
            <Button onClick={handleUploadAndParse} disabled={!selectedFile || isResumeLoading} className="w-full mt-2 bg-blue-600 text-white font-semibold shadow-none hover:bg-blue-700 transition-all rounded-lg text-sm py-2">
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
          </CardContent>
        </Card>
        {/* Scholar URL Section */}
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-2xl">
          <CardHeader className="bg-white rounded-t-2xl pb-2">
            <CardTitle className="flex items-center gap-2 text-purple-700 text-base font-semibold">
              <Search className="h-4 w-4" />
              Scholar Profile URL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="scholar-url" className="text-xs font-medium">Google Scholar Profile URL</Label>
              <Input
                id="scholar-url"
                type="url"
                placeholder="https://scholar.google.com/citations?user=..."
                value={scholarUrl}
                onChange={handleUrlChange}
                className="font-mono text-xs px-2 py-1 rounded border border-gray-200 focus:ring-2 focus:ring-purple-100"
              />
              <p className="text-xs text-muted-foreground">
                Example: https://scholar.google.com/citations?user=ABC123DEF
              </p>
            </div>
            {scholarError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{scholarError}</AlertDescription>
              </Alert>
            )}
            <Button onClick={handleFetchScholarData} disabled={isScholarLoading} className="w-full mt-2 bg-purple-600 text-white font-semibold shadow-none hover:bg-purple-700 transition-all rounded-lg text-sm py-2">
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
          </CardContent>
        </Card>
      </div>
      {/* Parsed Resume Card UI */}
      {parsedResume && (
        <div className="flex flex-col items-center mt-10">
          <Card className="w-full max-w-md border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-2xl relative p-0">
            <div className="absolute right-4 top-4">
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-100 px-3 py-1 text-xs font-medium shadow-none">Parsed</Badge>
            </div>
            <CardHeader className="bg-white rounded-t-2xl pb-2 px-6 pt-6">
              <CardTitle className="flex items-center gap-2 text-gray-900 text-base font-semibold">
                <User className="h-4 w-4 text-blue-400" />
                <span className="truncate">{parsedResume.name || <span className="italic text-gray-400">Name not found</span>}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 py-2 px-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="h-3 w-3 text-blue-300" />
                <span className="truncate">{parsedResume.email || <span className="italic text-gray-400">Email not found</span>}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="h-3 w-3 text-blue-300" />
                <span className="truncate">{parsedResume.phone || <span className="italic text-gray-400">Phone not found</span>}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Code className="h-3 w-3 text-blue-300" />
                <span className="font-medium text-gray-700 text-xs">Skills:</span>
                <div className="flex flex-wrap gap-2">
                  {filteredSkills.length > 0 ? (
                    filteredSkills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 px-2 py-0.5 text-xs font-normal shadow-none rounded-full">{skill}</Badge>
                    ))
                  ) : (
                    <span className="italic text-gray-400">No matching skills found</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-6 px-6 py-2 rounded-lg bg-blue-600 text-white font-medium shadow-none hover:bg-blue-700 transition-all text-sm min-w-[140px]">View Details</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg rounded-xl border border-gray-200 bg-white shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-blue-800 text-xl font-bold flex items-center gap-2">
                  <User className="h-5 w-5" /> Resume Details
                </DialogTitle>
                <DialogDescription>
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold text-gray-700">Name:</span>
                      <span className="font-medium text-gray-700">{parsedResume.name || <span className="italic text-gray-400">Not found</span>}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-blue-400" />
                      <span className="font-semibold text-gray-700">Email:</span>
                      <span className="font-medium text-gray-700">{parsedResume.email || <span className="italic text-gray-400">Not found</span>}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-blue-400" />
                      <span className="font-semibold text-gray-700">Phone:</span>
                      <span className="font-medium text-gray-700">{parsedResume.phone || <span className="italic text-gray-400">Not found</span>}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Code className="h-4 w-4 text-blue-400" />
                      <span className="font-semibold text-gray-700">Skills:</span>
                      <div className="flex flex-wrap gap-2">
                        {parsedResume.skills.length > 0 ? (
                          parsedResume.skills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 px-2 py-1 text-xs font-medium shadow-none">{skill}</Badge>
                          ))
                        ) : (
                          <span className="italic text-gray-400">Not found</span>
                        )}
                      </div>
                    </div>
                    {/* Show raw extracted text for transparency */}
                    {parsedResume.rawText && (
                      <div className="mt-6">
                        <div className="font-semibold mb-1 text-blue-700 text-xs">Raw Extracted Text:</div>
                        <div className="max-h-40 overflow-y-auto bg-gray-50 border border-gray-100 rounded p-2 text-xs text-gray-700 whitespace-pre-line">
                          {parsedResume.rawText}
                        </div>
                      </div>
                    )}
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Status message when waiting for both data sources */}
      {(parsedResume || scholarData) && !(parsedResume && scholarData) && (
        <Card className="border-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 shadow-none">
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

      {/* Recommended Projects Section */}
      {parsedResume && scholarData && (
        <RecommendedProjects
          resumeSkills={parsedResume.skills}
          scholarInterests={scholarData.interests}
          onRefresh={() => {
            console.log("Refreshing recommendations...")
          }}
        />
      )}
    </div>
  )
}
