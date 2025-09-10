import { NextRequest, NextResponse } from 'next/server'
import { auth } from "@clerk/nextjs/server"
import { prisma } from '@/lib/prisma'
import { isMockAuthEnabled, getMockAuth } from '@/lib/mock-auth'

// GET /api/shows - Get all shows for authenticated user
export async function GET(request: NextRequest) {
  try {
    let userId: string | null = null
    
    if (isMockAuthEnabled()) {
      const mockAuth = getMockAuth()
      userId = mockAuth.userId
    } else {
      const authResult = await auth()
      userId = authResult.userId
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const shows = await prisma.show.findMany({
      where: {
        userId: userId,
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
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ shows })
  } catch (error) {
    console.error('Error fetching shows:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shows' },
      { status: 500 }
    )
  }
}

// POST /api/shows - Create a new show
export async function POST(request: NextRequest) {
  try {
    let userId: string | null = null
    
    if (isMockAuthEnabled()) {
      const mockAuth = getMockAuth()
      userId = mockAuth.userId
    } else {
      const authResult = await auth()
      userId = authResult.userId
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Creating show...')
    const body = await request.json()
    console.log('Request body:', body)
    
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
      characters,
      auditionMaterials,
    } = body

    // Validate required fields
    if (!title || !director || !contactEmail) {
      console.log('Validation failed:', { title, director, contactEmail })
      return NextResponse.json(
        { error: 'Missing required fields: title, director, contactEmail' },
        { status: 400 }
      )
    }

    // Create the show
    console.log('Creating show in database...')
    const show = await prisma.show.create({
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
        status: 'active', // Set to active so it's publicly visible
        userId: userId,
        characters: {
          create: characters?.map((char: any) => ({
            name: char.name,
            description: char.description,
            gender: char.gender || 'Any',
            ageRange: char.ageRange,
            vocalRange: char.vocalRange,
            notes: char.notes,
          })) || [],
        },
        auditionMaterials: {
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

    console.log('Show created successfully:', show.id)
    return NextResponse.json({ 
      show,
      publicUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/shows/${show.id}`
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating show:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create show',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PUT /api/shows - Update an existing show
export async function PUT(request: NextRequest) {
  try {
    let userId: string | null = null
    
    if (isMockAuthEnabled()) {
      const mockAuth = getMockAuth()
      userId = mockAuth.userId
    } else {
      const authResult = await auth()
      userId = authResult.userId
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      id,
      title,
      description,
      director,
      organization,
      auditionDate,
      deadline,
      location,
      contactEmail,
      contactPhone,
      characters,
      auditionMaterials,
    } = body

    // Validate required fields
    if (!id || !title || !director || !contactEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: id, title, director, contactEmail' },
        { status: 400 }
      )
    }

    // Check if show exists and belongs to user
    const existingShow = await prisma.show.findFirst({
      where: {
        id: id,
        userId: userId,
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
      where: { id: id },
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
        // Update characters
        characters: {
          deleteMany: {}, // Delete existing characters
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
          deleteMany: {}, // Delete existing materials
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
      { 
        error: 'Failed to update show',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PATCH /api/shows - Duplicate an existing show
export async function PATCH(request: NextRequest) {
  try {
    let userId: string | null = null
    
    if (isMockAuthEnabled()) {
      const mockAuth = getMockAuth()
      userId = mockAuth.userId
    } else {
      const authResult = await auth()
      userId = authResult.userId
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      )
    }

    // Get the original show with all related data
    const originalShow = await prisma.show.findFirst({
      where: {
        id: id,
        userId: userId,
      },
      include: {
        characters: true,
        auditionMaterials: true,
      },
    })

    if (!originalShow) {
      return NextResponse.json(
        { error: 'Show not found or access denied' },
        { status: 404 }
      )
    }

    // Create the duplicate show
    const duplicatedShow = await prisma.show.create({
      data: {
        title: `${originalShow.title} (Copy)`,
        description: originalShow.description,
        director: originalShow.director,
        organization: originalShow.organization,
        auditionDate: originalShow.auditionDate,
        deadline: originalShow.deadline,
        location: originalShow.location,
        contactEmail: originalShow.contactEmail,
        contactPhone: originalShow.contactPhone,
        status: 'draft', // Set to draft so it's not immediately public
        userId: userId,
        characters: {
          create: originalShow.characters.map((char) => ({
            name: char.name,
            description: char.description,
            gender: char.gender,
            ageRange: char.ageRange,
            vocalRange: char.vocalRange,
            notes: char.notes,
          })),
        },
        auditionMaterials: {
          create: originalShow.auditionMaterials.map((material) => ({
            type: material.type,
            fileName: material.fileName,
            fileUrl: material.fileUrl,
            fileSize: material.fileSize,
            mimeType: material.mimeType,
          })),
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

    return NextResponse.json({ 
      show: duplicatedShow,
      message: 'Show duplicated successfully' 
    })
  } catch (error) {
    console.error('Error duplicating show:', error)
    return NextResponse.json(
      { 
        error: 'Failed to duplicate show',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}