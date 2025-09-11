import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Plus, 
  Users, 
  FileText, 
  Calendar,
  TrendingUp,
  Clock,
  ExternalLink,
  Copy
} from 'lucide-react'
import Link from 'next/link'
import { auth } from "@clerk/nextjs/server"
import { prisma } from '@/lib/prisma'
import { DuplicateShowButton } from '@/components/duplicate-show-button'
import { isMockAuthEnabled, getMockAuth } from '@/lib/mock-auth'

export default async function DashboardPage() {
  let userId: string | null = null
  
  if (isMockAuthEnabled()) {
    const mockAuth = getMockAuth()
    userId = mockAuth.userId
  } else {
    const authResult = await auth()
    userId = authResult.userId
  }
  
  if (!userId) {
    return <div>Please sign in to view your dashboard.</div>
  }

  // Get real data from database
  let shows = []
  try {
    shows = await prisma.show.findMany({
      where: { userId },
      include: {
        characters: true,
        applicants: true,
        auditionMaterials: true,
      },
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Database error:', error)
    // Soft fallback if new columns not yet present
    try {
      shows = await prisma.show.findMany({
        where: { userId },
        include: {
          characters: true,
          applicants: true,
        },
        orderBy: { createdAt: 'desc' }
      })
    } catch (err) {
      console.error('Fallback database error:', err)
    }
    // Fallback to empty array if database issues
    shows = []
  }

  const totalShows = shows.length
  const totalApplicants = shows.reduce((sum, show) => sum + show.applicants.length, 0)
  const totalCharacters = shows.reduce((sum, show) => sum + show.characters.length, 0)
  
  // Calculate storage used (mock for now)
  const storageUsed = 0 // TODO: Calculate actual storage usage
  const maxStorage = 100 // MB for free tier

  const recentActivity = shows.slice(0, 3).map(show => ({
    id: show.id,
    type: 'show_created',
    message: `Created "${show.title}" audition`,
    time: new Date(show.createdAt).toLocaleDateString(),
    icon: Plus,
  }))

  const upcomingDeadlines = shows
    .filter(show => show.deadline && new Date(show.deadline) > new Date())
    .slice(0, 3)
    .map(show => ({
      id: show.id,
      title: `${show.title} - Audition Deadline`,
      date: show.deadline ? new Date(show.deadline).toLocaleDateString() : 'No deadline',
      daysLeft: show.deadline ? Math.ceil((new Date(show.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0,
      showId: show.id,
    }))

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your auditions today.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shows</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShows}</div>
            <p className="text-xs text-muted-foreground">
              {totalShows} of 1 shows (Free Tier)
            </p>
            <Progress 
              value={(totalShows / 1) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplicants}</div>
            <p className="text-xs text-muted-foreground">
              {totalApplicants} of 25 applicants (Free Tier)
            </p>
            <Progress 
              value={(totalApplicants / 25) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storageUsed}MB</div>
            <p className="text-xs text-muted-foreground">
              {storageUsed} of {maxStorage}MB used
            </p>
            <Progress 
              value={(storageUsed / maxStorage) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan</CardTitle>
            <Badge variant="outline">Free</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Free Tier</div>
            <p className="text-xs text-muted-foreground">
              Upgrade for more shows and storage
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Get started with your next audition
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-start">
              <Link href="/dashboard/shows/create">
                <Plus className="mr-2 h-4 w-4" />
                Create New Show
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/shows">
                <FileText className="mr-2 h-4 w-4" />
                View All Shows
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" disabled>
              <Users className="mr-2 h-4 w-4" />
              Manage Characters
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates on your auditions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-muted-foreground text-sm">No recent activity</p>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines */}
      {upcomingDeadlines.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Deadlines
            </CardTitle>
            <CardDescription>
              Important dates for your auditions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{deadline.title}</p>
                    <p className="text-sm text-muted-foreground">{deadline.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={deadline.daysLeft <= 3 ? "destructive" : "secondary"}>
                      <Clock className="mr-1 h-3 w-3" />
                      {deadline.daysLeft} days left
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/shows/${deadline.showId}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Shows List */}
      {shows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Shows</CardTitle>
            <CardDescription>
              Manage your active auditions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shows.map((show) => (
                <div key={show.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h3 className="font-medium">{show.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {show.characters.length} characters • {show.applicants.length} applicants
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(show.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={show.status === 'active' ? 'default' : 'secondary'}>
                      {show.status}
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/shows/${show.id}`}>
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Public
                      </Link>
                    </Button>
                    <DuplicateShowButton showId={show.id} showTitle={show.title} />
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/shows/${show.id}`}>
                        Manage
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}