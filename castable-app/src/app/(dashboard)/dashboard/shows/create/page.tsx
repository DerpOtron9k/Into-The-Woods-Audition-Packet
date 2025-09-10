'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
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
  Check,
  Save,
  MapPin,
  Mail,
  Phone
} from 'lucide-react'
import { trackShowCreated } from '@/lib/analytics'
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
  { id: 'preview', title: 'Preview', description: 'See how your show will look to actors' },
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
  const [isLoadingFromTemplate, setIsLoadingFromTemplate] = useState(false)

  // Load template data on component mount
  useEffect(() => {
    const templateData = sessionStorage.getItem('templateData')
    if (templateData) {
      try {
        const parsed = JSON.parse(templateData)
        setShowData(prev => ({
          ...prev,
          ...parsed,
          // Ensure characters have proper structure
          characters: parsed.characters || []
        }))
        setIsLoadingFromTemplate(true)
        // Clear template data from session storage
        sessionStorage.removeItem('templateData')
      } catch (error) {
        console.error('Error loading template data:', error)
      }
    }
  }, [])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCreated, setShowCreated] = useState(false)
  const [createdShowId, setCreatedShowId] = useState('')
  const [copied, setCopied] = useState(false)
  const [isSavingTemplate, setIsSavingTemplate] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [showSaveTemplateDialog, setShowSaveTemplateDialog] = useState(false)

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
      
      // Track analytics event
      trackShowCreated(result.show.id, result.show.title)
      
      setCreatedShowId(result.show.id)
      setShowCreated(true)
    } catch (error) {
      console.error('Error creating show:', error)
      alert('Failed to create show. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      alert('Please enter a template name')
      return
    }

    setIsSavingTemplate(true)
    try {
      const templateData = {
        name: templateName,
        description: templateDescription,
        title: showData.title,
        showDescription: showData.description,
        director: showData.director,
        organization: showData.organization,
        location: showData.location,
        contactEmail: showData.contactEmail,
        contactPhone: showData.contactPhone,
        characters: showData.characters,
        auditionMaterials: Object.values(showData.auditionMaterials).flat()
      }

      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateData)
      })

      if (!response.ok) {
        throw new Error('Failed to save template')
      }

      setShowSaveTemplateDialog(false)
      setTemplateName('')
      setTemplateDescription('')
      alert('Template saved successfully!')
    } catch (error) {
      console.error('Error saving template:', error)
      alert('Failed to save template. Please try again.')
    } finally {
      setIsSavingTemplate(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      const publicUrl = `${window.location.origin}/shows/${createdShowId}`
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

      case 4:
        // Review step content
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Review Your Show</h3>
              <p className="text-muted-foreground">
                Review all details before publishing your show
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Dialog open={showSaveTemplateDialog} onOpenChange={setShowSaveTemplateDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save as Template
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save as Template</DialogTitle>
                    <DialogDescription>
                      Save this show configuration as a reusable template
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="templateName">Template Name *</Label>
                      <Input
                        id="templateName"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="e.g., Musical Template"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="templateDescription">Description</Label>
                      <Textarea
                        id="templateDescription"
                        value={templateDescription}
                        onChange={(e) => setTemplateDescription(e.target.value)}
                        placeholder="Brief description of this template"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowSaveTemplateDialog(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSaveTemplate} 
                        disabled={!templateName.trim() || isSavingTemplate}
                      >
                        {isSavingTemplate ? 'Saving...' : 'Save Template'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )

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
                      value={`${typeof window !== 'undefined' ? window.location.origin : ''}/shows/${createdShowId}`}
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
                      <a href={`/shows/${createdShowId}`} target="_blank" rel="noopener noreferrer">
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

      case 3: // Preview step
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
                              <MapPin className="h-5 w-5" />
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
                            <Mail className="h-5 w-5" />
                            Contact Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-primary">{showData.contactEmail || 'your-email@example.com'}</span>
                          </div>
                          {showData.contactPhone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
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
                                    {character.vocalRange && (
                                      <span>Vocal: {character.vocalRange}</span>
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
                            <Mail className="h-4 w-4 mr-2" />
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
                This is a preview. The actual page will be live after publishing.
              </p>
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