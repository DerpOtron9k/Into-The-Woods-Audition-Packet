import { NextRequest, NextResponse } from 'next/server'
import { auth } from "@clerk/nextjs/server"
import { prisma } from '@/lib/prisma'

// POST /api/shows/[id]/duplicate - Duplicate an existing show
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Get the original show
    const originalShow = await prisma.show.findFirst({
      where: { id: id, userId: userId },
      include: { 
        characters: true, 
        auditionMaterials: true 
      },
    })

    if (!originalShow) {
      return NextResponse.json({ error: 'Show not found or access denied' }, { status: 404 })
    }

    // Create duplicate with modified title and reset status
    const duplicatedShow = await prisma.show.create({
      data: {
        title: `${originalShow.title} (Copy)`,
        description: originalShow.description,
        director: originalShow.director,
        organization: originalShow.organization,
        location: originalShow.location,
        contactEmail: originalShow.contactEmail,
        contactPhone: originalShow.contactPhone,
        auditionDate: originalShow.auditionDate,
        deadline: originalShow.deadline,
        status: 'draft', // Set as draft so it can be edited before publishing
        userId: userId,
        characters: {
          create: originalShow.characters.map(character => ({
            name: character.name,
            description: character.description,
            gender: character.gender,
            ageRange: character.ageRange,
            vocalRange: character.vocalRange,
            notes: character.notes,
          }))
        },
        auditionMaterials: {
          create: originalShow.auditionMaterials.map(material => ({
            type: material.type,
            fileName: material.fileName,
            fileUrl: material.fileUrl,
            fileSize: material.fileSize,
            mimeType: material.mimeType,
          }))
        }
      },
      include: { 
        characters: true, 
        auditionMaterials: true,
        _count: { 
          select: { applicants: true } 
        }
      }
    })

    return NextResponse.json({ 
      show: duplicatedShow,
      message: 'Show duplicated successfully'
    })
  } catch (error) {
    console.error('Error duplicating show:', error)
    return NextResponse.json({ 
      error: 'Failed to duplicate show', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

