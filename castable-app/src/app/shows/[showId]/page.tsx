import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  Users, 
  FileText, 
  Music, 
  Video,
  Download,
  Play
} from 'lucide-react'
import Link from 'next/link'

interface PublicShowPageProps {
  params: {
    showId: string
  }
}

// Mock data for testing - in production this would come from database
const getMockShow = (showId: string) => {
  const mockShows = {
    'test-show-123': {
      id: 'test-show-123',
      title: 'Into the Woods',
      description: 'A musical about fairy tale characters and their intertwined stories.',
      director: 'Jane Smith',
      organization: 'Community Theater Group',
      auditionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      location: '123 Main St, City, State',
      contactEmail: 'director@theater.com',
      contactPhone: '(555) 123-4567',
      status: 'active',
      characters: [
        {
          id: '1',
          name: 'Cinderella',
          description: 'A kind-hearted young woman who dreams of a better life',
          gender: 'Female',
          ageRange: '18-25',
          vocalRange: 'Soprano',
          notes: 'Must be able to sing and dance'
        },
        {
          id: '2',
          name: 'The Baker',
          description: 'A determined baker on a quest to break a curse',
          gender: 'Male',
          ageRange: '25-35',
          vocalRange: 'Baritone',
          notes: 'Strong acting and singing required'
        }
      ],
      auditionMaterials: [
        {
          id: '1',
          type: 'script',
          fileName: 'audition-sides.pdf',
          fileUrl: 'https://example.com/audition-sides.pdf',
          fileSize: 1024000,
          mimeType: 'application/pdf'
        }
      ]
    },
    'expired-show': {
      id: 'expired-show',
      title: 'Expired Show',
      description: 'A show with a passed deadline',
      director: 'Test Director',
      contactEmail: 'director@theater.com',
      deadline: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      status: 'active',
      characters: [],
      auditionMaterials: []
    }
  }
  
  return mockShows[showId as keyof typeof mockShows] || null
}

export default async function PublicShowPage({ params }: PublicShowPageProps) {
  // Use mock data for now due to database issues
  const show = getMockShow(params.showId)

  if (!show) {
    notFound()
  }

  const isDeadlinePassed = show.deadline ? new Date(show.deadline) < new Date() : false
  const isAuditionDatePassed = show.auditionDate ? new Date(show.auditionDate) < new Date() : false

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

          {/* Status Banner */}
          {isDeadlinePassed ? (
            <Card className="border-destructive bg-destructive/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-destructive">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Application deadline has passed</span>
                </div>
              </CardContent>
            </Card>
          ) : isAuditionDatePassed ? (
            <Card className="border-yellow-500 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-yellow-700">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Audition date has passed, but applications may still be open</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-green-500 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-green-700">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Applications are open</span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-8 md:grid-cols-2">
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
                  {show.auditionDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Audition Date</p>
                      <p className="font-medium">
                        {new Date(show.auditionDate).toLocaleDateString('en-US', {
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
                  {show.deadline && (
                    <div>
                      <p className="text-sm text-muted-foreground">Application Deadline</p>
                      <p className="font-medium">
                        {new Date(show.deadline).toLocaleDateString('en-US', {
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

              {show.location && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{show.location}</p>
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
                    <a 
                      href={`mailto:${show.contactEmail}`}
                      className="text-primary hover:underline"
                    >
                      {show.contactEmail}
                    </a>
                  </div>
                  {show.contactPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={`tel:${show.contactPhone}`}
                        className="text-primary hover:underline"
                      >
                        {show.contactPhone}
                      </a>
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
                    Characters ({show.characters.length})
                  </CardTitle>
                  <CardDescription>
                    Roles available for audition
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {show.characters.length === 0 ? (
                    <p className="text-muted-foreground">No characters defined yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {show.characters.map((character) => (
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

              {/* Audition Materials */}
              {show.auditionMaterials.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Audition Materials
                    </CardTitle>
                    <CardDescription>
                      Download materials needed for your audition
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {show.auditionMaterials.map((material) => (
                        <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {material.type === 'script' && <FileText className="h-4 w-4 text-muted-foreground" />}
                            {material.type === 'music' && <Music className="h-4 w-4 text-muted-foreground" />}
                            {material.type === 'video' && <Video className="h-4 w-4 text-muted-foreground" />}
                            <div>
                              <p className="font-medium">{material.fileName}</p>
                              <p className="text-xs text-muted-foreground">
                                {material.mimeType} • {material.fileSize ? `${Math.round(material.fileSize / 1024)}KB` : 'Unknown size'}
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Application Form */}
          {!isDeadlinePassed && (
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
                    <Button asChild size="lg">
                      <Link href={`/shows/${show.id}/apply`}>
                        <Users className="h-4 w-4 mr-2" />
                        Apply Now
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href={`mailto:${show.contactEmail}?subject=Question about ${show.title}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Ask Director
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground pt-8 border-t">
            <p>Powered by <span className="font-medium">Castable</span> - The easiest way to manage auditions</p>
          </div>
        </div>
      </div>
    </div>
  )
}