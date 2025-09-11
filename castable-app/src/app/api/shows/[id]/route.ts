import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Public: fetch a single show by id with characters and materials
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const show = await prisma.show.findUnique({
      where: { id: params.id },
      include: { characters: true, auditionMaterials: true },
    })

    if (!show) return NextResponse.json({ error: 'Show not found' }, { status: 404 })

    // Optionally restrict access if not active
    // if (show.status !== 'active') return NextResponse.json({ error: 'Show is not public' }, { status: 403 })

    return NextResponse.json({ show })
  } catch (error) {
    console.error('Error fetching show:', error)
    return NextResponse.json({ error: 'Failed to fetch show' }, { status: 500 })
  }
}