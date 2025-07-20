"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RefreshCw, ExternalLink, Star, Clock, Users, Sparkles, Search } from "lucide-react"

interface ProjectRecommendation {
  id: string
  title: string
  description: string
  matchingTags: string[]
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  estimatedTime: string
  collaborators?: number
  githubUrl?: string
  demoUrl?: string
  matchScore: number
}

interface RecommendedProjectsProps {
  resumeSkills?: string[]
  scholarInterests?: string[]
  onRefresh?: () => void
}

export default function RecommendedProjects({
  resumeSkills = [],
  scholarInterests = [],
  onRefresh,
}: RecommendedProjectsProps) {
  const [projects, setProjects] = useState<ProjectRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const allSkillsAndInterests = [...new Set([...resumeSkills, ...scholarInterests])]

  const fetchRecommendations = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: resumeSkills, interests: scholarInterests }),
      })
      if (!res.ok) throw new Error("Failed to fetch recommendations")
      const data = await res.json()
      setProjects(data.projects || [])
    } catch (err: any) {
      setError(err.message || "Unknown error")
      setProjects([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (allSkillsAndInterests.length > 0) {
      fetchRecommendations()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeSkills, scholarInterests])

  const handleRefresh = () => {
    fetchRecommendations()
    onRefresh?.()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300"
      case "Intermediate":
        return "bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border-orange-300"
      case "Advanced":
        return "bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-300"
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-300"
    }
  }

  if (allSkillsAndInterests.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Recommended Projects
            </span>
          </h2>
          <p className="text-muted-foreground">
            Personalized project suggestions based on your skills and research interests
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="border-orange-200 hover:bg-orange-50 bg-transparent"
        >
          {isLoading ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin text-orange-500" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4 text-orange-500" />
          )}
          Refresh Recommendations
        </Button>
      </div>

      {error && (
        <div className="text-red-600 bg-red-50 border border-red-200 rounded p-4">
          Error: {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 bg-muted rounded w-16"></div>
                  <div className="h-6 bg-muted rounded w-20"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="group border border-gray-200 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-0 hover:-translate-y-1"
            >
              <CardHeader className="space-y-3 pb-2 bg-white rounded-t-2xl">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-base font-semibold leading-tight group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-xs ${getDifficultyColor(project.difficulty)} border-none px-2 py-0.5 rounded-full font-medium`}>{project.difficulty}</Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-current text-yellow-400" />
                        <span className="font-medium text-yellow-600">{project.matchScore}% match</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-0 pb-4 px-4">
                <p className="text-xs text-muted-foreground leading-relaxed">{project.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {project.estimatedTime}
                    </div>
                    {project.collaborators && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {project.collaborators} collaborators
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Matching Skills:</div>
                    <div className="flex flex-wrap gap-1">
                      {project.matchingTags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-100 rounded-full font-normal shadow-none">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {(project.githubUrl || project.demoUrl) && (
                    <div className="flex gap-2 pt-2">
                      {project.githubUrl && (
                        <Button variant="outline" size="sm" className="flex-1 text-xs h-8 bg-gray-50 border border-gray-200 rounded-lg" asChild>
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-1 h-3 w-3" />
                            GitHub
                          </a>
                        </Button>
                      )}
                      {project.demoUrl && (
                        <Button variant="outline" size="sm" className="flex-1 text-xs h-8 bg-gray-50 border border-gray-200 rounded-lg" asChild>
                          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-1 h-3 w-3" />
                            Demo
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 border-blue-300 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-blue-700">No Recommendations Found</h3>
                <p className="text-blue-600 max-w-md mx-auto">
                  We couldn't find any project recommendations based on your current skills and interests. Try uploading
                  a more detailed resume or adding more research interests to your Scholar profile.
                </p>
              </div>
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="mt-4 border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
