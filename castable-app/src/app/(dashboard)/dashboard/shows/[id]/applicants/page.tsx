'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

interface Applicant {
  id: string
  name: string
  email: string
  phone: string | null
  createdAt: string
  selectedRoles?: string[]
  headshotUrl?: string | null
  resumeUrl?: string | null
  auditionFileUrl?: string | null
  experience?: string | null
  availability?: string | null
  additionalNotes?: string | null
  selectedRoleNames?: string[]
}

export default function ApplicantsPage({ params }: { params: { id: string } }) {
  const routeParams = useParams() as { id: string }
  const showParamId = routeParams?.id || params?.id
  const [rows, setRows] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Applicant | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const targetId = showParamId
        if (!targetId) return
        const res = await fetch(`/api/shows/${targetId}/applicants`)
        if (!res.ok) throw new Error('Failed to fetch applicants')
        const data = await res.json()
        setRows(data.applicants || [])
      } catch {
        setRows([])
      } finally {
        setLoading(false)
      }
    })()
  }, [showParamId])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Applicants</h1>
        <Link href={`/dashboard/shows`}>Back</Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="text-muted-foreground">No applicants yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(a => (
                  <TableRow key={a.id} onClick={() => setSelected(a)} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>{a.name}</TableCell>
                    <TableCell>{a.email}</TableCell>
                    <TableCell>{a.phone || '-'}</TableCell>
                    <TableCell>{new Date(a.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selected && (
        <Card>
          <CardHeader>
            <CardTitle>Applicant Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Name</div>
                <div className="font-medium">{selected.name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium">{selected.email}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Phone</div>
                <div className="font-medium">{selected.phone || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Submitted</div>
                <div className="font-medium">{new Date(selected.createdAt).toLocaleString()}</div>
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Roles</div>
              <div className="flex flex-wrap gap-2">
                {(selected.selectedRoleNames || selected.selectedRoles || []).length === 0 && <span className="text-muted-foreground text-sm">-</span>}
                {(selected.selectedRoleNames || selected.selectedRoles || []).map(r => (
                  <Badge key={r} variant="secondary">{r}</Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Headshot</div>
                {selected.headshotUrl ? <a className="text-primary underline" href={`/api/uploads/sign-get?url=${encodeURIComponent(selected.headshotUrl)}`} target="_blank">View</a> : <span className="text-muted-foreground text-sm">-</span>}
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Resume</div>
                {selected.resumeUrl ? <a className="text-primary underline" href={`/api/uploads/sign-get?url=${encodeURIComponent(selected.resumeUrl)}`} target="_blank">View</a> : <span className="text-muted-foreground text-sm">-</span>}
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Video</div>
                {selected.auditionFileUrl ? <a className="text-primary underline" href={`/api/uploads/sign-get?url=${encodeURIComponent(selected.auditionFileUrl)}`} target="_blank">View</a> : <span className="text-muted-foreground text-sm">-</span>}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Experience</div>
              <div className="whitespace-pre-wrap text-sm">{selected.experience || '-'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Availability</div>
              <div className="whitespace-pre-wrap text-sm">{selected.availability || '-'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Notes</div>
              <div className="whitespace-pre-wrap text-sm">{selected.additionalNotes || '-'}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


