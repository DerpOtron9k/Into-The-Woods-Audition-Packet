import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// GET /api/shows/[id] - Get a specific show
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const show = await prisma.show.findFirst({
      where: { 
        id: params.id,
        userId 
      },
      include: {
        characters: true,
        auditionMaterials: true,
        _count: {
          select: {
            applicants: true,
          },
        },
      }
    })

    if (!show) {
      return NextResponse.json({ error: 'Show not found' }, { status: 404 })
    }

    return NextResponse.json({ show })
  } catch (error) {
    console.error('Error fetching show:', error)
    return NextResponse.json({ error: 'Failed to fetch show' }, { status: 500 })
  }
}