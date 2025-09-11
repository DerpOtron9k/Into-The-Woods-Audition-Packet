import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { isMockAuthEnabled, getMockAuth } from '@/lib/mock-auth'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    let userId: string | null = null
    if (isMockAuthEnabled()) {
      const mockAuth = getMockAuth()
      userId = mockAuth.userId
    } else {
      const authResult = await auth()
      userId = authResult.userId
    }

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const show = await prisma.show.findFirst({ where: { id: params.id, userId } })
    if (!show) return NextResponse.json({ error: 'Show not found or access denied' }, { status: 404 })

    const applicants = await prisma.applicant.findMany({
      where: { showId: params.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    })
    return NextResponse.json({ applicants })
  } catch (error) {
    console.error('Error fetching applicants:', error)
    return NextResponse.json({ error: 'Failed to fetch applicants' }, { status: 500 })
  }
}


