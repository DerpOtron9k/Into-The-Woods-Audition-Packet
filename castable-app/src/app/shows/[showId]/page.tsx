import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  MapPin,
  Mail,
  Users,
  FileText,
  Download,
  Clock,
  Theater,
  Music,
  UserCheck,
} from 'lucide-react'
import Link from 'next/link'
import { ShowViewTracker } from '@/components/show-view-tracker'

interface PublicShowPageProps {
  params: {
    showId: string
  }
}

async function getShowData(showId: string) {
  const show = await prisma.show.findUnique({
    where: { id: showId },
    include: {
      characters: {
        orderBy: {
          name: 'asc',
        },
      },
      auditionMaterials: true,
    },
  })
  return show
}

export default async function PublicShowPage({ params }: PublicShowPageProps) {
  const show = await getShowData(params.showId)

  if (!show) {
    notFound()
  }

  const isDeadlinePassed = show.deadline ? new Date(show.deadline) < new Date() : false

  const principalCharacters = show.characters.filter(c => c.category === 'Principal')
  const supportingCharacters = show.characters.filter(c => c.category === 'Supporting')
  const cameoCharacters = show.characters.filter(c => c.category === 'Cameo' || c.category === 'Ensemble')


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <ShowViewTracker showId={show.id} showTitle={show.title} />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-[#2E4035]">{show.title}</h1>
          <p className="text-xl text-gray-600">Audition Packet</p>
        </header>

        {show.greetingMessage && (
            <section className="mb-10 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-3xl font-semibold border-b-2 border-[#D4C4B0] pb-2 mb-4 text-[#2E4035]">Greetings</h2>
                <p className="text-base leading-relaxed whitespace-pre-wrap">{show.greetingMessage}</p>
            </section>
        )}

        <section className="mb-10">
            <h2 className="text-3xl font-semibold mb-4 text-[#2E4035]">Show Information</h2>
            <Card className="bg-white shadow-sm border-gray-200">
                <CardContent className="p-6 grid md:grid-cols-2 gap-6 text-base">
                    <div className="flex items-start space-x-3">
                        <Users className="h-5 w-5 mt-1 text-[#2E4035]" />
                        <div><span className="font-semibold">Director:</span> {show.director}</div>
                    </div>
                    {show.musicDirector && (
                        <div className="flex items-start space-x-3">
                            <Music className="h-5 w-5 mt-1 text-[#2E4035]" />
                            <div><span className="font-semibold">Music Director:</span> {show.musicDirector}</div>
                        </div>
                    )}
                    {show.choreographer && (
                        <div className="flex items-start space-x-3">
                            <UserCheck className="h-5 w-5 mt-1 text-[#2E4035]" />
                            <div><span className="font-semibold">Choreographer:</span> {show.choreographer}</div>
                        </div>
                    )}
                    {show.organization && (
                        <div className="flex items-start space-x-3">
                            <Theater className="h-5 w-5 mt-1 text-[#2E4035]" />
                            <div><span className="font-semibold">Producing Organization:</span> {show.organization}</div>
                        </div>
                    )}
                    {show.venue && (
                         <div className="flex items-start space-x-3">
                            <MapPin className="h-5 w-5 mt-1 text-[#2E4035]" />
                            <div><span className="font-semibold">Venue:</span> {show.venue}</div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>

        <section className="mb-10">
          <h2 className="text-3xl font-semibold mb-4 text-[#2E4035]">Audition Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calendar className="h-5 w-5 text-[#2E4035]" />
                  Important Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base">
                {show.auditionDate && (
                  <div>
                    <p className="font-semibold">Audition Date</p>
                    <p>{new Date(show.auditionDate).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
                  </div>
                )}
                {show.deadline && (
                  <div>
                    <p className="font-semibold">Application Deadline</p>
                    <p className={isDeadlinePassed ? "text-red-600" : ""}>{new Date(show.deadline).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
                  </div>
                )}
              </CardContent>
            </Card>
             <Card className="bg-white shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MapPin className="h-5 w-5 text-[#2E4035]" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-base">
                {show.location && <p className="font-medium">{show.location}</p>}
                 <div className="flex items-center gap-2 pt-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <a href={`mailto:${show.contactEmail}`} className="text-[#2E4035] hover:underline">{show.contactEmail}</a>
                  </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {show.auditionPrepRequirements && (
            <section className="mb-10 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-3xl font-semibold border-b-2 border-[#D4C4B0] pb-2 mb-4 text-[#2E4035]">What to Prepare</h2>
                <div className="prose max-w-none text-base leading-relaxed whitespace-pre-wrap">{show.auditionPrepRequirements}</div>
            </section>
        )}
        
        <section className="mb-10">
          <h2 className="text-3xl font-semibold mb-2 text-[#2E4035]">Character Breakdowns</h2>
          <p className="mb-6 text-base text-gray-600">Below are the roles available for this production.</p>
          
          {principalCharacters.length > 0 && (
            <>
              <h3 className="text-2xl font-semibold mb-4 text-[#405a49]">Principal Roles</h3>
              <div className="space-y-6">
                {principalCharacters.map(character => <CharacterCard key={character.id} character={character} />)}
              </div>
            </>
          )}

          {supportingCharacters.length > 0 && (
            <>
              <h3 className="text-2xl font-semibold mt-8 mb-4 text-[#405a49]">Supporting Roles</h3>
              <div className="space-y-6">
                {supportingCharacters.map(character => <CharacterCard key={character.id} character={character} />)}
              </div>
            </>
          )}

          {cameoCharacters.length > 0 && (
            <>
              <h3 className="text-2xl font-semibold mt-8 mb-4 text-[#405a49]">Cameo / Ensemble Roles</h3>
              <div className="space-y-6">
                {cameoCharacters.map(character => <CharacterCard key={character.id} character={character} />)}
              </div>
            </>
          )}
        </section>
        
        <section className="mb-10">
          <h2 className="text-3xl font-semibold mb-4 text-[#2E4035]">Rehearsals & Casting</h2>
          <div className="space-y-6 text-base">
            {show.rehearsalPeriod && (
              <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 mt-1 text-[#2E4035]" />
                  <div><span className="font-semibold">Rehearsal Period:</span> {show.rehearsalPeriod}</div>
              </div>
            )}
            {show.rehearsalInfo && (
              <div className="p-4 bg-white rounded-lg shadow-sm border">
                <h4 className="font-semibold mb-2">Rehearsal Details</h4>
                <p className="whitespace-pre-wrap">{show.rehearsalInfo}</p>
              </div>
            )}
            {show.castingInfo && (
              <div className="p-4 bg-white rounded-lg shadow-sm border">
                <h4 className="font-semibold mb-2">Casting Information</h4>
                <p className="whitespace-pre-wrap">{show.castingInfo}</p>
              </div>
            )}
          </div>
        </section>
        
        {!isDeadlinePassed ? (
          <section className="text-center mt-12 py-8 bg-white rounded-lg shadow-md border">
            <h2 className="text-3xl font-semibold mb-4 text-[#2E4035]">Ready to Audition?</h2>
            <p className="text-gray-600 mb-6">Proceed to the next step to get your materials and sign up.</p>
            <Button asChild size="lg" className="bg-[#2E4035] text-white hover:bg-[#405a49]">
              <Link href={`/shows/${show.id}/apply`}>
                <Users className="h-5 w-5 mr-2" />
                Proceed to Sign Up
              </Link>
            </Button>
          </section>
        ) : (
           <section className="text-center mt-12 py-8 bg-white rounded-lg shadow-md border">
            <h2 className="text-3xl font-semibold mb-4 text-red-700">Auditions Closed</h2>
            <p className="text-gray-600 mb-6">The application deadline for this show has passed.</p>
            <Button disabled size="lg">
              Applications Closed
            </Button>
          </section>
        )}

      </div>
       <footer className="text-center text-sm text-gray-500 py-6 border-t">
          <p>Powered by <a href="/" className="font-medium text-[#2E4035] hover:underline">Castable</a> - The easiest way to manage auditions</p>
       </footer>
    </div>
  )
}


function CharacterCard({ character }: { character: any }) {
  return (
    <Card className="bg-white shadow-sm overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-[#2E4035]">{character.name}</CardTitle>
            <div className="flex items-center gap-2">
                <Badge variant="secondary">{character.gender}</Badge>
                {character.ageRange && <Badge variant="secondary">Age: {character.ageRange}</Badge>}
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-base text-gray-700">{character.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {character.vocalInfo && (
                <div className="p-3 bg-gray-50 rounded-md">
                    <h5 className="font-semibold mb-1">Vocal Information</h5>
                    <p>{character.vocalInfo}</p>
                </div>
            )}
            {character.auditionCut && (
                <div className="p-3 bg-gray-50 rounded-md">
                    <h5 className="font-semibold mb-1">Audition Cut</h5>
                    <p>{character.auditionCut}</p>
                </div>
            )}
        </div>
        {character.notes && (
          <div className="pt-2">
            <h5 className="font-semibold mb-1 text-sm">Director's Notes</h5>
            <p className="text-sm text-gray-600 italic whitespace-pre-wrap">{character.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}