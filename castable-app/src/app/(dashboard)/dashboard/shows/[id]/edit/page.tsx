'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Upload,
  Calendar,
  Users,
  FileText,
  Music,
  Video,
  ExternalLink,
  Save,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

interface Character {
  id: string
  name: string
  description: string
  gender: string
  ageRange: string
  notes: string

  // New fields from schema
  category?: string
  vocalInfo?: string
  auditionCut?: string
}

interface AuditionMaterial {
  type: string
  fileName: string
  fileUrl: string
  fileSize?: number
  mimeType?: string
}

interface ShowData {
  id: string
  title: string
  description: string
  director: string
  organization: string
  auditionDate: string
  deadline: string
  location: string
  contactEmail: string
  contactPhone: string
  characters: Character[]
  auditionMaterials: Record<string, AuditionMaterial | File>

  // New fields from schema
  greetingMessage?: string
  auditionPrepRequirements?: string
  rehearsalInfo?: string
  castingInfo?: string
  musicDirector?: string
  choreographer?: string
  venue?: string
  rehearsalPeriod?: string
}

const STEPS = [
  { id: 'basic', title: 'Basic Information', description: 'Show details and contact info' },
  { id: 'characters', title: 'Characters', description: 'Define roles and requirements' },
  { id: 'materials', title: 'Audition Materials', description: 'Upload scripts, music, and videos' },
  { id: 'preview', title: 'Preview', description: 'See how your show will look to actors' },
  { id: 'review', title: 'Review & Save', description: 'Final review before saving changes' },
]

export default function EditShowPage() {
  const params = useParams()
  const router = useRouter()
  const showId = params.id as string
  
  const [currentStep, setCurrentStep] = useState(0)
  const [showData, setShowData] = useState<ShowData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load show data
  useEffect(() => {
    const fetchShow = async () => {
      try {
        const response = await fetch(`/api/shows/${showId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch show')
        }
        const data = await response.json()
        setShowData(data.show)
      } catch (error) {
        console.error('Error fetching show:', error)
        setError('Failed to load show data')
      } finally {
        setLoading(false)
      }
    }

    if (showId) {
      fetchShow()
    }
  }, [showId])

  const addCharacter = () => {
    if (!showData) return
    
    const newCharacter: Character = {
      id: Date.now().toString(),
      name: '',
      description: '',
      gender: 'Any',
      ageRange: '',
      notes: '',
      category: 'Supporting',
      vocalInfo: '',
      auditionCut: '',
    }
    setShowData(prev => prev ? {
      ...prev,
      characters: [...prev.characters, newCharacter]
    } : null)
  }

  const removeCharacter = (id: string) => {
    if (!showData) return
    
    setShowData(prev => prev ? {
      ...prev,
      characters: prev.characters.filter(char => char.id !== id)
    } : null)
  }

  const updateCharacter = (id: string, field: keyof Character, value: string) => {
    if (!showData) return
    
    setShowData(prev => prev ? {
      ...prev,
      characters: prev.characters.map(char =>
        char.id === id ? { ...char, [field]: value } : char
      )
    } : null)
  }

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = async () => {
    if (!showData) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/shows', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...showData,
          auditionMaterials: Object.values(showData.auditionMaterials).filter(material => 
            typeof material === 'object' && 'fileUrl' in material
          )
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update show')
      }

      // Redirect to shows list
      router.push('/dashboard/shows')
    } catch (error) {
      console.error('Error updating show:', error)
      setError('Failed to update show. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const renderStepContent = () => {
    if (!showData) return null

    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Show Title *</Label>
                <Input
                  id="title"
                  value={showData.title}
                  onChange={(e) => setShowData(prev => prev ? { ...prev, title: e.target.value } : null)}
                  placeholder="e.g., Into the Woods"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="director">Director *</Label>
                <Input
                  id="director"
                  value={showData.director}
                  onChange={(e) => setShowData(prev => prev ? { ...prev, director: e.target.value } : null)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="musicDirector">Music Director</Label>
                <Input
                  id="musicDirector"
                  value={showData.musicDirector}
                  onChange={(e) => setShowData(prev => prev ? { ...prev, musicDirector: e.target.value } : null)}
                  placeholder="Music Director's name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="choreographer">Choreographer</Label>
                <Input
                  id="choreographer"
                  value={showData.choreographer}
                  onChange={(e) => setShowData(prev => prev ? { ...prev, choreographer: e.target.value } : null)}
                  placeholder="Choreographer's name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Show Description *</Label>
              <Textarea
                id="description"
                value={showData.description}
                onChange={(e) => setShowData(prev => prev ? { ...prev, description: e.target.value } : null)}
                placeholder="Describe the show, its themes, and what you're looking for in actors..."
                rows={4}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="greetingMessage">Greeting Message</Label>
              <Textarea
                id="greetingMessage"
                value={showData.greetingMessage}
                onChange={(e) => setShowData(prev => prev ? { ...prev, greetingMessage: e.target.value } : null)}
                placeholder="A welcome message for your potential auditioners..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="auditionPrepRequirements">What to Prepare</Label>
              <Textarea
                id="auditionPrepRequirements"
                value={showData.auditionPrepRequirements}
                onChange={(e) => setShowData(prev => prev ? { ...prev, auditionPrepRequirements: e.target.value } : null)}
                placeholder="Describe what actors should prepare for the audition (e.g., songs, monologues, sides)..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rehearsalInfo">Rehearsal Information</Label>
              <Textarea
                id="rehearsalInfo"
                value={showData.rehearsalInfo}
                onChange={(e) => setShowData(prev => prev ? { ...prev, rehearsalInfo: e.target.value } : null)}
                placeholder="Details about the rehearsal schedule, location, and expectations..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="castingInfo">Casting Information</Label>
              <Textarea
                id="castingInfo"
                value={showData.castingInfo}
                onChange={(e) => setShowData(prev => prev ? { ...prev, castingInfo: e.target.value } : null)}
                placeholder="Information about your casting philosophy (e.g., inclusive casting)..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="organization">Organization/Theater</Label>
                <Input
                  id="organization"
                  value={showData.organization}
                  onChange={(e) => setShowData(prev => prev ? { ...prev, organization: e.target.value } : null)}
                  placeholder="Community Theater Group"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  value={showData.venue}
                  onChange={(e) => setShowData(prev => prev ? { ...prev, venue: e.target.value } : null)}
                  placeholder="e.g., The Grand Theatre"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rehearsalPeriod">Rehearsal Period</Label>
                <Input
                  id="rehearsalPeriod"
                  value={showData.rehearsalPeriod}
                  onChange={(e) => setShowData(prev => prev ? { ...prev, rehearsalPeriod: e.target.value } : null)}
                  placeholder="e.g., January 2025 – May 2025"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Audition Location</Label>
                <Input
                  id="location"
                  value={showData.location}
                  onChange={(e) => setShowData(prev => prev ? { ...prev, location: e.target.value } : null)}
                  placeholder="123 Main St, City, State"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="auditionDate">Audition Date</Label>
                <Input
                  id="auditionDate"
                  type="datetime-local"
                  value={showData.auditionDate}
                  onChange={(e) => setShowData(prev => prev ? { ...prev, auditionDate: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={showData.deadline}
                  onChange={(e) => setShowData(prev => prev ? { ...prev, deadline: e.target.value } : null)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={showData.contactEmail}
                  onChange={(e) => setShowData(prev => prev ? { ...prev, contactEmail: e.target.value } : null)}
                  placeholder="director@theater.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  value={showData.contactPhone}
                  onChange={(e) => setShowData(prev => prev ? { ...prev, contactPhone: e.target.value } : null)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Characters</h3>
              <Button onClick={addCharacter} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Character
              </Button>
            </div>

            {showData.characters.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No characters defined</h3>
                  <p className="text-muted-foreground mb-4">
                    Add characters to define the roles available for audition
                  </p>
                  <Button onClick={addCharacter}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Character
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {showData.characters.map((character, index) => (
                  <Card key={character.id}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Character {index + 1}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCharacter(character.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Character Name *</Label>
                          <Input
                            value={character.name}
                            onChange={(e) => updateCharacter(character.id, 'name', e.target.value)}
                            placeholder="Character name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Select
                            value={character.category}
                            onValueChange={(value) => updateCharacter(character.id, 'category', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Principal">Principal</SelectItem>
                              <SelectItem value="Supporting">Supporting</SelectItem>
                              <SelectItem value="Cameo">Cameo</SelectItem>
                              <SelectItem value="Ensemble">Ensemble</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Gender</Label>
                          <Select
                            value={character.gender}
                            onValueChange={(value) => updateCharacter(character.id, 'gender', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Any">Any</SelectItem>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Character Description</Label>
                        <Textarea
                          value={character.description}
                          onChange={(e) => updateCharacter(character.id, 'description', e.target.value)}
                          placeholder="Describe the character, their role in the story, and what you're looking for in the actor..."
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Age Range</Label>
                          <Input
                            value={character.ageRange}
                            onChange={(e) => updateCharacter(character.id, 'ageRange', e.target.value)}
                            placeholder="e.g., 18-25, 30-40"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Vocal Information</Label>
                          <Input
                            value={character.vocalInfo}
                            onChange={(e) => updateCharacter(character.id, 'vocalInfo', e.target.value)}
                            placeholder="e.g., Soprano (G3-A5), Baritone"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Audition Cut</Label>
                        <Input
                          value={character.auditionCut}
                          onChange={(e) => updateCharacter(character.id, 'auditionCut', e.target.value)}
                          placeholder="e.g., 'No More', m. 79-109"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Additional Notes</Label>
                        <Textarea
                          value={character.notes}
                          onChange={(e) => updateCharacter(character.id, 'notes', e.target.value)}
                          placeholder="Any special requirements, skills needed, or other notes..."
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Audition Materials</h3>
              <p className="text-muted-foreground">
                Upload scripts, music, and videos for actors to prepare
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Scripts
                  </CardTitle>
                  <CardDescription>
                    Upload script excerpts or full scripts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop files here, or click to browse
                    </p>
                    <Button variant="outline" size="sm">
                      Choose Files
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="h-5 w-5" />
                    Music
                  </CardTitle>
                  <CardDescription>
                    Upload sheet music or audio files
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop files here, or click to browse
                    </p>
                    <Button variant="outline" size="sm">
                      Choose Files
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Videos
                  </CardTitle>
                  <CardDescription>
                    Upload video files or links
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop files here, or click to browse
                    </p>
                    <Button variant="outline" size="sm">
                      Choose Files
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Other Materials
                  </CardTitle>
                  <CardDescription>
                    Upload any other relevant materials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop files here, or click to browse
                    </p>
                    <Button variant="outline" size="sm">
                      Choose Files
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Uploaded Materials</CardTitle>
                <CardDescription>
                  Files you've uploaded for this show
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No files uploaded yet</p>
              </CardContent>
            </Card>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Preview Your Show</h3>
              <p className="text-muted-foreground">
                This is how actors will see your audition page
              </p>
            </div>

            {/* Preview Container */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">Preview Mode</p>
              </div>
              
              {/* Mock Public Show Page Preview */}
              <div className="bg-white rounded-lg shadow-sm border max-w-4xl mx-auto">
                {/* Header */}
                <div className="border-b bg-background/95 p-4">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Castable</h1>
                    <Badge variant="outline">Free Tier</Badge>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Show Header */}
                  <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold">{showData.title || 'Your Show Title'}</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      {showData.description || 'Your show description will appear here...'}
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Directed by {showData.director || 'Your Name'}</span>
                      </div>
                      {showData.organization && (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>{showData.organization}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Banner */}
                  <Card className="border-green-500 bg-green-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 text-green-700">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">Applications are open</span>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Show Details */}
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Important Dates
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {showData.auditionDate && (
                            <div>
                              <p className="text-sm text-muted-foreground">Audition Date</p>
                              <p className="font-medium">
                                {new Date(showData.auditionDate).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          )}
                          {showData.deadline && (
                            <div>
                              <p className="text-sm text-muted-foreground">Application Deadline</p>
                              <p className="font-medium">
                                {new Date(showData.deadline).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {showData.location && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Calendar className="h-5 w-5" />
                              Location
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="font-medium">{showData.location}</p>
                          </CardContent>
                        </Card>
                      )}

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Contact Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-primary">{showData.contactEmail || 'your-email@example.com'}</span>
                          </div>
                          {showData.contactPhone && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-primary">{showData.contactPhone}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Characters */}
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Characters ({showData.characters.length})
                          </CardTitle>
                          <CardDescription>
                            Roles available for audition
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {showData.characters.length === 0 ? (
                            <p className="text-muted-foreground">No characters defined yet.</p>
                          ) : (
                            <div className="space-y-4">
                              {showData.characters.map((character) => (
                                <div key={character.id} className="border rounded-lg p-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-medium">{character.name}</h4>
                                    <Badge variant="outline">{character.gender}</Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {character.description}
                                  </p>
                                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                    {character.ageRange && (
                                      <span>Age: {character.ageRange}</span>
                                    )}
                                    {character.vocalInfo && (
                                      <span>Vocal: {character.vocalInfo}</span>
                                    )}
                                  </div>
                                  {character.notes && (
                                    <p className="text-xs text-muted-foreground mt-2 italic">
                                      {character.notes}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Application Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Apply for This Show</CardTitle>
                      <CardDescription>
                        Submit your application to audition for this production
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-6">
                          Ready to audition? Fill out our simple application form to get started.
                        </p>
                        <div className="flex gap-4 justify-center">
                          <Button size="lg" disabled>
                            <Users className="h-4 w-4 mr-2" />
                            Apply Now
                          </Button>
                          <Button variant="outline" disabled>
                            <Calendar className="h-4 w-4 mr-2" />
                            Ask Director
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                This is a preview. The actual page will be live after saving.
              </p>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Review Your Changes</h3>
              <p className="text-muted-foreground">
                Review all changes before saving
              </p>
            </div>

            {/* Show Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Show Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                    <p className="font-medium">{showData.title || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Director</Label>
                    <p className="font-medium">{showData.director || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Organization</Label>
                    <p className="font-medium">{showData.organization || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Contact Email</Label>
                    <p className="font-medium">{showData.contactEmail || 'Not specified'}</p>
                  </div>
                </div>
                {showData.description && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                    <p className="text-sm">{showData.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Characters Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Characters ({showData.characters.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showData.characters.length === 0 ? (
                  <p className="text-muted-foreground">No characters defined</p>
                ) : (
                  <div className="space-y-2">
                    {showData.characters.map((character) => (
                      <div key={character.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <span className="font-medium">{character.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">({character.gender})</span>
                        </div>
                        <Badge variant="outline">{character.ageRange || 'Any age'}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/shows">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shows
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Edit Show</h1>
        </div>
        <div className="text-center py-8">
          <p>Loading show data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/shows">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shows
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Edit Show</h1>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Error Loading Show</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!showData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/shows">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shows
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Edit Show</h1>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">Show Not Found</h3>
            <p className="text-muted-foreground mb-4">The show you're looking for doesn't exist or you don't have permission to edit it.</p>
            <Button asChild>
              <Link href="/dashboard/shows">Back to Shows</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/shows">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shows
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Show</h1>
          <p className="text-muted-foreground">{showData.title}</p>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Step {currentStep + 1} of {STEPS.length}</span>
              <span>{Math.round(((currentStep + 1) / STEPS.length) * 100)}%</span>
            </div>
            <Progress value={((currentStep + 1) / STEPS.length) * 100} />
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="ml-2 hidden sm:block">
                    <p className="text-xs font-medium">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep].title}</CardTitle>
          <CardDescription>{STEPS[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        
        {currentStep === STEPS.length - 1 ? (
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        ) : currentStep === 2 ? (
          // Materials step - show both Preview and Next buttons
          <div className="flex gap-2">
            <Button variant="outline" onClick={nextStep}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button onClick={nextStep}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}


