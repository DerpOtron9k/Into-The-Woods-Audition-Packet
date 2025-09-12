import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { isMockAuthEnabled, getMockAuth } from '@/lib/mock-auth'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    let userId: string | null = null
    if (isMockAuthEnabled()) {
      const mockAuth = getMockAuth()
      userId = mockAuth.userId
    } else {
      const authResult = await auth()
      userId = authResult.userId
    }

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const show = await prisma.show.findFirst({ where: { id, userId } })
    if (!show) return NextResponse.json({ error: 'Show not found or access denied' }, { status: 404 })

    const [applicants, characters] = await Promise.all([
      prisma.applicant.findMany({
        where: { showId: id },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          createdAt: true,
          selectedRoles: true,
          headshotUrl: true,
          resumeUrl: true,
          auditionFileUrl: true,
          experience: true,
          availability: true,
          additionalNotes: true,
        },
      }),
      prisma.character.findMany({
        where: { showId: id },
        select: { id: true, name: true },
      }),
    ])

    const idToName = new Map(characters.map(c => [c.id, c.name] as const))
    const enriched = applicants.map(a => ({
      ...a,
      selectedRoleNames: (a.selectedRoles || []).map(id => idToName.get(id) || id),
    }))

    return NextResponse.json({ applicants: enriched })
  } catch (error) {
    console.error('Error fetching applicants:', error)
    return NextResponse.json({ error: 'Failed to fetch applicants' }, { status: 500 })
  }
}


