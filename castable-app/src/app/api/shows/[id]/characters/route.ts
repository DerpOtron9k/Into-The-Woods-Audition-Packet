import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { isMockAuthEnabled, getMockAuth } from '@/lib/mock-auth'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const body = await request.json()
    const characters = Array.isArray(body?.characters) ? body.characters : []
    if (!characters.length) return NextResponse.json({ error: 'No characters provided' }, { status: 400 })

    // Ensure ownership
    const show = await prisma.show.findFirst({ where: { id, userId } })
    if (!show) return NextResponse.json({ error: 'Show not found or access denied' }, { status: 404 })

    // Replace characters
    await prisma.character.deleteMany({ where: { showId: id } })
    const created = await prisma.character.createMany({
      data: characters.map((c: any) => ({
        showId: id,
        name: c.name,
        description: c.description || null,
        gender: c.gender || 'Any',
        ageRange: c.ageRange || null,
        vocalRange: c.vocalRange || null,
        notes: c.notes || null,
      })),
      skipDuplicates: true,
    })

    return NextResponse.json({ created: created.count })
  } catch (error) {
    console.error('Error setting characters:', error)
    return NextResponse.json({ error: 'Failed to set characters' }, { status: 500 })
  }
}


