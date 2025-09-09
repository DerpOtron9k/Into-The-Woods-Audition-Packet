import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/shows/[id] - Get a specific show
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const showId = params.id

    const show = await prisma.show.findUnique({
      where: {
        id: showId,
      },
      include: {
        characters: true,
        auditionMaterials: true,
        _count: {
          select: {
            applicants: true,
          },
        },
      },
    })

    if (!show) {
      return NextResponse.json(
        { error: 'Show not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ show })
  } catch (error) {
    console.error('Error fetching show:', error)
    return NextResponse.json(
      { error: 'Failed to fetch show' },
      { status: 500 }
    )
  }
}

// PUT /api/shows/[id] - Update a specific show
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const showId = params.id
    const body = await request.json()
    const {
      title,
      description,
      director,
      organization,
      auditionDate,
      deadline,
      location,
      contactEmail,
      contactPhone,
      status,
      characters,
      auditionMaterials,
    } = body

    // For now, we'll use a test user ID since Clerk is disabled
    // In production, you would check if the user owns this show
    const testUserId = 'test-user-123'

    // Check if show exists and belongs to user
    const existingShow = await prisma.show.findFirst({
      where: {
        id: showId,
        userId: testUserId,
      },
    })

    if (!existingShow) {
      return NextResponse.json(
        { error: 'Show not found or access denied' },
        { status: 404 }
      )
    }

    // Update the show
    const show = await prisma.show.update({
      where: {
        id: showId,
      },
      data: {
        title,
        description,
        director,
        organization,
        auditionDate: auditionDate ? new Date(auditionDate) : null,
        deadline: deadline ? new Date(deadline) : null,
        location,
        contactEmail,
        contactPhone,
        status: status || 'draft',
        // Update characters
        characters: {
          deleteMany: {}, // Remove all existing characters
          create: characters?.map((char: any) => ({
            name: char.name,
            description: char.description,
            gender: char.gender || 'Any',
            ageRange: char.ageRange,
            vocalRange: char.vocalRange,
            notes: char.notes,
          })) || [],
        },
        // Update audition materials
        auditionMaterials: {
          deleteMany: {}, // Remove all existing materials
          create: auditionMaterials?.map((material: any) => ({
            type: material.type,
            fileName: material.fileName,
            fileUrl: material.fileUrl,
            fileSize: material.fileSize,
            mimeType: material.mimeType,
          })) || [],
        },
      },
      include: {
        characters: true,
        auditionMaterials: true,
        _count: {
          select: {
            applicants: true,
          },
        },
      },
    })

    return NextResponse.json({ show })
  } catch (error) {
    console.error('Error updating show:', error)
    return NextResponse.json(
      { error: 'Failed to update show' },
      { status: 500 }
    )
  }
}

// DELETE /api/shows/[id] - Delete a specific show
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const showId = params.id

    // For now, we'll use a test user ID since Clerk is disabled
    // In production, you would check if the user owns this show
    const testUserId = 'test-user-123'

    // Check if show exists and belongs to user
    const existingShow = await prisma.show.findFirst({
      where: {
        id: showId,
        userId: testUserId,
      },
    })

    if (!existingShow) {
      return NextResponse.json(
        { error: 'Show not found or access denied' },
        { status: 404 }
      )
    }

    // Delete the show (cascade will handle related records)
    await prisma.show.delete({
      where: {
        id: showId,
      },
    })

    return NextResponse.json({ message: 'Show deleted successfully' })
  } catch (error) {
    console.error('Error deleting show:', error)
    return NextResponse.json(
      { error: 'Failed to delete show' },
      { status: 500 }
    )
  }
}
