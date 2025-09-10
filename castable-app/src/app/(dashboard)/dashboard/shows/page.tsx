'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Users,
  Calendar,
  FileText,
  Copy
} from 'lucide-react'
import Link from 'next/link'

interface Show {
  id: string
  title: string
  description: string | null
  status: string
  deadline: string | null
  createdAt: string
  characters: Array<{
    name: string
    gender: string
    ageRange: string | null
  }>
  _count: {
    applicants: number
  }
}

export default function ShowsPage() {
  const [shows, setShows] = useState<Show[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [duplicating, setDuplicating] = useState<string | null>(null)

  useEffect(() => {
    fetchShows()
  }, [])

  const fetchShows = async () => {
    try {
      const response = await fetch('/api/shows')
      if (!response.ok) {
        throw new Error('Failed to fetch shows')
      }
      const data = await response.json()
      setShows(data.shows)
    } catch (error) {
      console.error('Error fetching shows:', error)
      setError('Failed to load shows')
    } finally {
      setLoading(false)
    }
  }

  const duplicateShow = async (showId: string) => {
    setDuplicating(showId)
    try {
      const response = await fetch(`/api/shows/${showId}/duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to duplicate show')
      }
      
      const data = await response.json()
      
      // Refresh the shows list
      await fetchShows()
      
      // Show success message
      alert(`Show "${data.show.title}" duplicated successfully!`)
    } catch (error) {
      console.error('Error duplicating show:', error)
      alert('Failed to duplicate show. Please try again.')
    } finally {
      setDuplicating(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>
      case 'closed':
        return <Badge variant="outline">Closed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Shows</h1>
            <p className="text-muted-foreground">
              Manage your audition shows and track applications
            </p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading shows...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Shows</h1>
            <p className="text-muted-foreground">
              Manage your audition shows and track applications
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Shows</h3>
            <p className="text-muted-foreground text-center mb-4">{error}</p>
            <Button onClick={fetchShows}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Shows</h1>
          <p className="text-muted-foreground">
            Manage your audition shows and track applications
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/shows/create">
            <Plus className="mr-2 h-4 w-4" />
            Create New Show
          </Link>
        </Button>
      </div>

      {/* Shows List */}
      <div className="space-y-4">
        {shows.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No shows yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first audition show to start receiving applications
              </p>
              <Button asChild>
                <Link href="/dashboard/shows/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Show
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {shows.map((show) => (
              <Card key={show.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{show.title}</CardTitle>
                      <CardDescription className="text-base">
                        {show.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(show.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Show Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          Applications
                        </p>
                        <p className="text-2xl font-bold">
                          {show._count.applicants}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          applications received
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          Characters
                        </p>
                        <p className="text-2xl font-bold">
                          {show.characters.length}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          roles available
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          Deadline
                        </p>
                        <p className="text-2xl font-bold">
                          {show.deadline ? formatDate(show.deadline) : 'Not set'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          application deadline
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          Created
                        </p>
                        <p className="text-2xl font-bold">
                          {formatDate(show.createdAt)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          show created
                        </p>
                      </div>
                    </div>

                    {/* Characters Preview */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Characters ({show.characters.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {show.characters.map((character, index) => (
                          <Badge key={index} variant="outline">
                            {character.name} ({character.gender}, {character.ageRange})
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-4 border-t">
                      <Button asChild size="sm">
                        <Link href={`/dashboard/shows/${show.id}/applicants`}>
                          <Users className="mr-2 h-4 w-4" />
                          View Applicants ({show._count.applicants})
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/shows/${show.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Public Page
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/shows/${show.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Show
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => duplicateShow(show.id)}
                        disabled={duplicating === show.id}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        {duplicating === show.id ? 'Duplicating...' : 'Duplicate'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        Manage Schedule
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
