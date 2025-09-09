'use client'

import { useState } from 'react'
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
  Copy,
  Check
} from 'lucide-react'
import Link from 'next/link'

interface Character {
  id: string
  name: string
  description: string
  gender: 'Male' | 'Female' | 'Any'
  ageRange: string
  vocalRange?: string
  notes?: string
}

interface ShowData {
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
  auditionMaterials: {
    script?: File
    music?: File
    video?: File
    other?: File[]
  }
}

const STEPS = [
  { id: 'basic', title: 'Basic Information', description: 'Show details and contact info' },
  { id: 'characters', title: 'Characters', description: 'Define roles and requirements' },
  { id: 'materials', title: 'Audition Materials', description: 'Upload scripts, music, and videos' },
  { id: 'review', title: 'Review & Publish', description: 'Final review before going live' },
]

export default function CreateShowPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showData, setShowData] = useState<ShowData>({
    title: '',
    description: '',
    director: '',
    organization: '',
    auditionDate: '',
    deadline: '',
    location: '',
    contactEmail: '',
    contactPhone: '',
    characters: [],
    auditionMaterials: {}
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCreated, setShowCreated] = useState(false)
  const [publicUrl, setPublicUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const addCharacter = () => {
    const newCharacter: Character = {
      id: Date.now().toString(),
      name: '',
      description: '',
      gender: 'Any',
      ageRange: '',
      vocalRange: '',
      notes: ''
    }
    setShowData(prev => ({
      ...prev,
      characters: [...prev.characters, newCharacter]
    }))
  }

  const updateCharacter = (id: string, field: keyof Character, value: string) => {
    setShowData(prev => ({
      ...prev,
      characters: prev.characters.map(char => 
        char.id === id ? { ...char, [field]: value } : char
      )
    }))
  }

  const removeCharacter = (id: string) => {
    setShowData(prev => ({
      ...prev,
      characters: prev.characters.filter(char => char.id !== id)
    }))
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

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/shows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...showData,
          auditionMaterials: [], // TODO: Handle file uploads
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error(`Failed to create show: ${errorData.error || 'Unknown error'}`)
      }

      const result = await response.json()
      console.log('Show created successfully:', result.show)
      
      setPublicUrl(result.publicUrl)
      setShowCreated(true)
    } catch (error) {
      console.error('Error creating show:', error)
      alert('Failed to create show. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const renderStepContent = () => {
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
                  onChange={(e) => setShowData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Into the Woods"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="director">Director *</Label>
                <Input
                  id="director"
                  value={showData.director}
                  onChange={(e) => setShowData(prev => ({ ...prev, director: e.target.value }))}
                  placeholder="Your name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Show Description *</Label>
              <Textarea
                id="description"
                value={showData.description}
                onChange={(e) => setShowData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the show, its themes, and what you're looking for in actors..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="organization">Organization/Theater</Label>
                <Input
                  id="organization"
                  value={showData.organization}
                  onChange={(e) => setShowData(prev => ({ ...prev, organization: e.target.value }))}
                  placeholder="Community Theater Group"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Audition Location</Label>
                <Input
                  id="location"
                  value={showData.location}
                  onChange={(e) => setShowData(prev => ({ ...prev, location: e.target.value }))}
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
                  onChange={(e) => setShowData(prev => ({ ...prev, auditionDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={showData.deadline}
                  onChange={(e) => setShowData(prev => ({ ...prev, deadline: e.target.value }))}
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
                  onChange={(e) => setShowData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  placeholder="director@theater.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  value={showData.contactPhone}
                  onChange={(e) => setShowData(prev => ({ ...prev, contactPhone: e.target.value }))}
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
              <div>
                <h3 className="text-lg font-semibold">Characters</h3>
                <p className="text-sm text-muted-foreground">
                  Define the roles you're casting for
                </p>
              </div>
              <Button onClick={addCharacter} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Character
              </Button>
            </div>

            {showData.characters.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No characters yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Add characters to define the roles you're casting for
                  </p>
                  <Button onClick={addCharacter}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Character
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {showData.characters.map((character, index) => (
                  <Card key={character.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          Character {index + 1}
                        </CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeCharacter(character.id)}
                          className="text-destructive hover:text-destructive"
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
                            placeholder="e.g., Cinderella"
                          />
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
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Any">Any</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description *</Label>
                        <Textarea
                          value={character.description}
                          onChange={(e) => updateCharacter(character.id, 'description', e.target.value)}
                          placeholder="Describe the character, their role in the story, and what you're looking for..."
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
                          <Label>Vocal Range (if applicable)</Label>
                          <Input
                            value={character.vocalRange || ''}
                            onChange={(e) => updateCharacter(character.id, 'vocalRange', e.target.value)}
                            placeholder="e.g., Soprano, Tenor, Baritone"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Additional Notes</Label>
                        <Textarea
                          value={character.notes || ''}
                          onChange={(e) => updateCharacter(character.id, 'notes', e.target.value)}
                          placeholder="Any special requirements, audition instructions, or other notes..."
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
            <div>
              <h3 className="text-lg font-semibold">Audition Materials</h3>
              <p className="text-sm text-muted-foreground">
                Upload files that actors will need for their auditions
              </p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Script/Text
                  </CardTitle>
                  <CardDescription>
                    Upload the script or audition sides
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOC, DOCX up to 10MB
                    </p>
                    <Input type="file" accept=".pdf,.doc,.docx" className="mt-4" />
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
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, MP3, WAV up to 50MB
                    </p>
                    <Input type="file" accept=".pdf,.mp3,.wav" className="mt-4" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Video
                  </CardTitle>
                  <CardDescription>
                    Upload video files or choreography videos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      MP4, MOV up to 100MB
                    </p>
                    <Input type="file" accept=".mp4,.mov" className="mt-4" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 3:
        if (showCreated) {
          return (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold">Show Published Successfully!</h3>
                <p className="text-muted-foreground">
                  Your audition page is now live and ready to receive applications.
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Public Audition Page</CardTitle>
                  <CardDescription>
                    Share this link with actors to view your audition information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={publicUrl}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild>
                      <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Public Page
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/dashboard/shows">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Shows
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">• Share the public link with actors and on social media</p>
                  <p className="text-sm">• Monitor applications in your dashboard</p>
                  <p className="text-sm">• Upload audition materials when ready</p>
                  <p className="text-sm">• Set up email notifications for new applications</p>
                </CardContent>
              </Card>
            </div>
          )
        }

        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Review Your Show</h3>
              <p className="text-sm text-muted-foreground">
                Double-check everything before publishing your audition
              </p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Title:</span>
                    <span className="font-medium">{showData.title || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Director:</span>
                    <span className="font-medium">{showData.director || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Organization:</span>
                    <span className="font-medium">{showData.organization || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deadline:</span>
                    <span className="font-medium">
                      {showData.deadline ? new Date(showData.deadline).toLocaleString() : 'Not set'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Characters ({showData.characters.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {showData.characters.length === 0 ? (
                    <p className="text-muted-foreground">No characters added</p>
                  ) : (
                    <div className="space-y-2">
                      {showData.characters.map((character, index) => (
                        <div key={character.id} className="flex items-center justify-between p-2 border rounded">
                          <span className="font-medium">{character.name || `Character ${index + 1}`}</span>
                          <Badge variant="outline">{character.gender}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Audition Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No files uploaded yet</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (showCreated) {
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
            <h1 className="text-3xl font-bold tracking-tight">Show Published!</h1>
            <p className="text-muted-foreground">
              Your audition page is now live and ready to receive applications
            </p>
          </div>
        </div>

        {/* Success Content */}
        {renderStepContent()}
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
          <h1 className="text-3xl font-bold tracking-tight">Create New Show</h1>
          <p className="text-muted-foreground">
            Set up your audition and start receiving applications
          </p>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Step {currentStep + 1} of {STEPS.length}</span>
              <span>{Math.round(((currentStep + 1) / STEPS.length) * 100)}% Complete</span>
            </div>
            <Progress value={((currentStep + 1) / STEPS.length) * 100} />
            <div className="flex justify-between">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center space-y-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="text-center">
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
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Publishing...' : 'Publish Show'}
          </Button>
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