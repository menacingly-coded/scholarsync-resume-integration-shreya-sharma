"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Loader2,
  AlertCircle,
  User,
  BookOpen,
  Quote,
  TrendingUp,
  ExternalLink,
  Calendar,
  Users,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
  const [scholarUrl, setScholarUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [scholarData, setScholarData] = useState<ScholarData | null>(null)

  const validateGoogleScholarUrl = (url: string): boolean => {
    const scholarUrlPattern = /^https:\/\/scholar\.google\.[a-z.]+\/citations\?user=[\w-]+/
    return scholarUrlPattern.test(url)
  }

  const handleFetchScholarData = async () => {
    if (!scholarUrl.trim()) {
      setError("Please enter a Google Scholar profile URL")
      return
    }

    if (!validateGoogleScholarUrl(scholarUrl)) {
      setError("Please enter a valid Google Scholar profile URL (e.g., https://scholar.google.com/citations?user=...)")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call to fetch scholar data
      await new Promise((resolve) => setTimeout(resolve, 2500))

      // Mock scholar data - in real implementation, this would come from your scraping service
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
          {
            title: "Multimodal Learning with Vision-Language Models: A Systematic Review",
            authors: ["S Chen", "K Thompson", "D Lee", "M Rodriguez", "J Smith"],
            venue: "IEEE Transactions on Pattern Analysis and Machine Intelligence",
            year: 2022,
            citations: 675,
            url: "#",
          },
          {
            title: "Federated Learning in Healthcare: Privacy-Preserving Machine Learning for Medical Data",
            authors: ["S Chen", "A Patel", "R Kumar"],
            venue: "Nature Digital Medicine",
            year: 2021,
            citations: 520,
            url: "#",
          },
          {
            title: "Graph Neural Networks for Social Network Analysis: Methods and Applications",
            authors: ["S Chen", "T Wilson", "H Kim"],
            venue: "ACM Computing Surveys",
            year: 2021,
            citations: 445,
            url: "#",
          },
        ],
        verified: true,
      }

      setScholarData(mockScholarData)
    } catch (err) {
      setError("Failed to fetch scholar data. Please check the URL and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScholarUrl(event.target.value)
    if (error) setError("")
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Google Scholar Profile Analyzer</h1>
        <p className="text-muted-foreground">Enter a Google Scholar profile URL to fetch and analyze academic data</p>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
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

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button onClick={handleFetchScholarData} disabled={isLoading} className="w-full">
            {isLoading ? (
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

      {/* Scholar Data Display */}
      {scholarData && (
        <div className="space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={scholarData.profileImage || "/placeholder.svg"} alt={scholarData.name} />
                    <AvatarFallback className="text-lg">
                      {scholarData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">{scholarData.name}</h2>
                      {scholarData.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{scholarData.affiliation}</p>
                    {scholarData.email && <p className="text-sm text-muted-foreground">{scholarData.email}</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Research Interests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Research Interests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {scholarData.interests.map((interest, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Citation Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Citation Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {scholarData.metrics.totalCitations.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Citations</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{scholarData.metrics.hIndex}</div>
                  <div className="text-sm text-muted-foreground">h-index</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{scholarData.metrics.i10Index}</div>
                  <div className="text-sm text-muted-foreground">i10-index</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {scholarData.metrics.citationsSince2019.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Since 2019</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Publications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Quote className="h-5 w-5" />
                Recent Publications ({scholarData.publications.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {scholarData.publications.map((publication, index) => (
                <div key={index} className="space-y-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <h4 className="font-medium leading-tight">
                        {publication.url ? (
                          <a
                            href={publication.url}
                            className="hover:text-primary hover:underline flex items-center gap-1"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {publication.title}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          publication.title
                        )}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {publication.authors.join(", ")}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-medium">{publication.venue}</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {publication.year}
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-lg font-semibold text-primary">{publication.citations}</div>
                      <div className="text-xs text-muted-foreground">citations</div>
                    </div>
                  </div>
                  {index < scholarData.publications.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Fallback message when no data */}
      {!scholarData && !isLoading && !error && (
        <Card>
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Scholar Data</h3>
            <p className="text-muted-foreground">
              Enter a Google Scholar profile URL above to fetch and display academic information.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
