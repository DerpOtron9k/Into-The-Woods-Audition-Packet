'use client'

import { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'
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
  Upload,
  Calendar, 
  Users, 
  FileText, 
  Music, 
  Video,
  Download,
  Check,
  AlertCircle,
  User,
  Mail,
  Phone,
  Camera,
  FileUp
} from 'lucide-react'
import Link from 'next/link'

interface Character {
  id: string
  name: string
  description: string
  gender: string
  ageRange?: string
  vocalRange?: string
  notes?: string
}

interface Show {
  id: string
  title: string
  description: string
  director: string
  organization?: string
  auditionDate?: string
  deadline?: string
  location?: string
  contactEmail: string
  contactPhone?: string
  characters: Character[]
  auditionMaterials: Array<{
    id: string
    type: string
    fileName: string
    fileUrl: string
    fileSize?: number
    mimeType?: string
  }>
}

interface ApplicationData {
  name: string
  email: string
  phone: string
  selectedRoles: string[]
  headshot: File | null
  resume: File | null
  auditionVideo: File | null
  additionalNotes: string
  experience: string
  availability: string
  headshotUrl?: string
  resumeUrl?: string
  auditionVideoUrl?: string
}

export default function ApplyPage() {
  const routeParams = useParams() as { showId: string }
  const showId = routeParams?.showId
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    name: '',
    email: '',
    phone: '',
    selectedRoles: [],
    headshot: null,
    resume: null,
    auditionVideo: null,
    additionalNotes: '',
    experience: '',
    availability: ''
  })

  const [show, setShow] = useState<Show | null>(null)
  const [isLoadingShow, setIsLoadingShow] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`/api/shows/${showId}`)
        if (!res.ok) throw new Error('Failed to load show')
        const data = await res.json()
        setShow(data.show)
      } catch (e) {
        console.error(e)
        setShow(null)
      } finally {
        setIsLoadingShow(false)
      }
    })()
  }, [showId])

  const STEPS = [
    { id: 'roles', title: 'Select Roles', description: 'Choose which characters you want to audition for' },
    { id: 'personal', title: 'Personal Information', description: 'Your contact details and experience' },
    { id: 'materials', title: 'Upload Materials', description: 'Headshot, resume, and audition video' },
    { id: 'review', title: 'Review & Submit', description: 'Double-check everything before submitting' },
  ]

  if (isLoadingShow) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading show…</p>
      </div>
    )
  }

  if (!show) return notFound()

  const isDeadlinePassed = show.deadline ? new Date(show.deadline) < new Date() : false
  const isAuditionDatePassed = show.auditionDate ? new Date(show.auditionDate) < new Date() : false

  if (isDeadlinePassed) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold">
                Castable
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="border-destructive bg-destructive/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-2 text-destructive mb-4">
                  <AlertCircle className="h-8 w-8" />
                  <h1 className="text-2xl font-bold">Application Deadline Passed</h1>
                </div>
                <p className="text-muted-foreground mb-4">
                  The application deadline for this show has passed. Please contact the director directly if you're still interested.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button asChild>
                    <a href={`mailto:${show.contactEmail}?subject=Late Application for ${show.title}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Director
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/shows/${show.id}`}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Show
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const handleRoleToggle = (characterId: string) => {
    setApplicationData(prev => ({
      ...prev,
      selectedRoles: prev.selectedRoles.includes(characterId)
        ? prev.selectedRoles.filter(id => id !== characterId)
        : [...prev.selectedRoles, characterId]
    }))
  }

  const handleFileUpload = (field: keyof ApplicationData, file: File) => {
    setApplicationData(prev => ({
      ...prev,
      [field]: file
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
      // Upload files to S3 via presigned URLs first
      async function presignAndUpload(file: File | null, folder: string): Promise<string | null> {
        if (!file) return null
        const presignRes = await fetch('/api/uploads/presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name, contentType: file.type, folder }),
        })
        if (!presignRes.ok) throw new Error('Failed to presign upload')
        const { uploadUrl, fileUrl } = await presignRes.json()
        const putRes = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file })
        if (!putRes.ok) throw new Error('Failed to upload file')
        return fileUrl as string
      }

      const [headshotUrl, resumeUrl, auditionVideoUrl] = await Promise.all([
        presignAndUpload(applicationData.headshot, `shows/${showId}/headshots`),
        presignAndUpload(applicationData.resume, `shows/${showId}/resumes`),
        presignAndUpload(applicationData.auditionVideo, `shows/${showId}/videos`),
      ])

      const response = await fetch('/api/applicants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          showId: show.id,
          name: applicationData.name,
          email: applicationData.email,
          phone: applicationData.phone,
          selectedRoles: applicationData.selectedRoles,
          experience: applicationData.experience,
          availability: applicationData.availability,
          additionalNotes: applicationData.additionalNotes,
          headshotUrl,
          resumeUrl,
          auditionVideoUrl,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error(`Failed to submit application: ${errorData.error || 'Unknown error'}`)
      }

      const result = await response.json()
      console.log('Application submitted successfully:', result)
      
      // Show success
      setCurrentStep(4) // Success step
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Select Roles to Audition For</h3>
              <p className="text-sm text-muted-foreground">
                Choose which characters you'd like to be considered for. You can select multiple roles.
              </p>
            </div>

            <div className="space-y-4">
              {show.characters.map((character) => (
                <Card 
                  key={character.id} 
                  className={`cursor-pointer transition-colors ${
                    applicationData.selectedRoles.includes(character.id)
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-muted-foreground/50'
                  }`}
                  onClick={() => handleRoleToggle(character.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{character.name}</h4>
                          <Badge variant="outline">{character.gender}</Badge>
                          {applicationData.selectedRoles.includes(character.id) && (
                            <Badge className="bg-primary">Selected</Badge>
                          )}
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {applicationData.selectedRoles.length === 0 && (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Please select at least one role to continue.</p>
              </div>
            )}
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
              <p className="text-sm text-muted-foreground">
                Tell us about yourself and your experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={applicationData.name}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={applicationData.email}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={applicationData.phone}
                onChange={(e) => setApplicationData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Theater Experience *</Label>
              <Textarea
                id="experience"
                value={applicationData.experience}
                onChange={(e) => setApplicationData(prev => ({ ...prev, experience: e.target.value }))}
                placeholder="Tell us about your theater experience, training, and previous roles..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <Textarea
                id="availability"
                value={applicationData.availability}
                onChange={(e) => setApplicationData(prev => ({ ...prev, availability: e.target.value }))}
                placeholder="Any scheduling conflicts or availability notes..."
                rows={3}
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Upload Materials</h3>
              <p className="text-sm text-muted-foreground">
                Upload your headshot, resume, and audition video.
              </p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Headshot
                  </CardTitle>
                  <CardDescription>
                    Professional headshot (JPG, PNG, max 5MB)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload or drag and drop
                    </p>
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload('headshot', file)
                      }}
                    />
                    {applicationData.headshot && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ {applicationData.headshot.name}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileUp className="h-5 w-5" />
                    Resume
                  </CardTitle>
                  <CardDescription>
                    Your acting resume (PDF, DOC, max 10MB)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload or drag and drop
                    </p>
                    <Input 
                      type="file" 
                      accept=".pdf,.doc,.docx" 
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload('resume', file)
                      }}
                    />
                    {applicationData.resume && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ {applicationData.resume.name}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Audition Video
                  </CardTitle>
                  <CardDescription>
                    Video of you performing (MP4, MOV, max 100MB)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload or drag and drop
                    </p>
                    <Input 
                      type="file" 
                      accept="video/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload('auditionVideo', file)
                      }}
                    />
                    {applicationData.auditionVideo && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ {applicationData.auditionVideo.name}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                value={applicationData.additionalNotes}
                onChange={(e) => setApplicationData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                placeholder="Any additional information you'd like to share..."
                rows={3}
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Review Your Application</h3>
              <p className="text-sm text-muted-foreground">
                Double-check everything before submitting your application.
              </p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Selected Roles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {applicationData.selectedRoles.map(roleId => {
                      const character = show.characters.find(c => c.id === roleId)
                      return character ? (
                        <div key={roleId} className="flex items-center justify-between p-2 border rounded">
                          <span className="font-medium">{character.name}</span>
                          <Badge variant="outline">{character.gender}</Badge>
                        </div>
                      ) : null
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{applicationData.name || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{applicationData.email || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{applicationData.phone || 'Not provided'}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Uploaded Materials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Headshot:</span>
                    <span className="font-medium">
                      {applicationData.headshot ? applicationData.headshot.name : 'Not uploaded'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resume:</span>
                    <span className="font-medium">
                      {applicationData.resume ? applicationData.resume.name : 'Not uploaded'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Audition Video:</span>
                    <span className="font-medium">
                      {applicationData.auditionVideo ? applicationData.auditionVideo.name : 'Not uploaded'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold">Application Submitted Successfully!</h3>
              <p className="text-muted-foreground">
                Thank you for your interest in {show.title}. You should receive a confirmation email shortly.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">• You'll receive a confirmation email within 24 hours</p>
                <p className="text-sm">• The director will review applications and contact you if selected</p>
                <p className="text-sm">• Auditions are scheduled for {show.auditionDate ? new Date(show.auditionDate).toLocaleDateString() : 'TBD'}</p>
                <p className="text-sm">• Contact the director directly if you have any questions</p>
              </CardContent>
            </Card>

            <div className="flex gap-2 justify-center">
              <Button asChild>
                <a href={`mailto:${show.contactEmail}?subject=Application for ${show.title}`}>
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Director
                </a>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/shows/${show.id}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Show
                </Link>
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              Castable
            </Link>
            <div className="flex items-center gap-4">
              <Badge variant="outline">Free Tier</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Show Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">{show.title}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {show.description}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Directed by {show.director}</span>
              </div>
              {show.organization && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{show.organization}</span>
                </div>
              )}
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
              <CardTitle>{STEPS[currentStep]?.title}</CardTitle>
              <CardDescription>{STEPS[currentStep]?.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Navigation */}
          {currentStep < 4 && (
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
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              ) : (
                <Button onClick={nextStep}>
                  Next
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
