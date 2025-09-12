import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from '@/lib/prisma'
import { isMockAuthEnabled, getMockAuth } from '@/lib/mock-auth'

// Ensure the authenticated Clerk user exists in our database
async function ensureUserExists(userId: string) {
  try {
    // Fast path: if user already exists, return
    const existing = await prisma.user.findUnique({ where: { id: userId } })
    if (existing) return

    let email = ''
    try {
      const user = await currentUser()
      email = user?.emailAddresses?.[0]?.emailAddress || ''
    } catch {}

    if (!email) email = `${userId}@users.local`

    await prisma.user.create({
      data: { id: userId, email },
    })
  } catch (err) {
    console.log('ensureUserExists error:', err)
  }
}

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

    // Make sure the user exists in our DB (prevents FK errors elsewhere)
    await ensureUserExists(userId)

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
            characters: true,
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

    // Make sure the user exists in our DB before creating a show
    await ensureUserExists(userId)

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
      events,
      // New fields from schema
      greetingMessage,
      auditionPrepRequirements,
      rehearsalInfo,
      castingInfo,
      musicDirector,
      choreographer,
      venue,
      rehearsalPeriod,
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
        greetingMessage,
        auditionPrepRequirements,
        rehearsalInfo,
        castingInfo,
        musicDirector,
        choreographer,
        venue,
        rehearsalPeriod,
        characters: {
          create: characters?.map((char: any) => ({
            name: char.name,
            description: char.description,
            gender: char.gender || 'Any',
            ageRange: char.ageRange,
            notes: char.notes,
            category: char.category,
            vocalInfo: char.vocalInfo,
            auditionCut: char.auditionCut,
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
        // @ts-ignore - events relation exists in schema and runtime
        events: (
          events?.map((e: any) => ({
            type: e.type,
            startAt: new Date(e.startAt),
            endAt: e.endAt ? new Date(e.endAt) : null,
            timezone: e.timezone || null,
            location: e.location || null,
            notes: e.notes || null,
          })) || []
        ).length
          ? { create: events.map((e: any) => ({
              type: e.type,
              startAt: new Date(e.startAt),
              endAt: e.endAt ? new Date(e.endAt) : null,
              timezone: e.timezone || null,
              location: e.location || null,
              notes: e.notes || null,
            })) }
          : undefined,
      },
      include: {
        characters: true,
        auditionMaterials: true,
        _count: {
          select: {
            applicants: true,
            characters: true,
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
      events,
      // New fields from schema
      greetingMessage,
      auditionPrepRequirements,
      rehearsalInfo,
      castingInfo,
      musicDirector,
      choreographer,
      venue,
      rehearsalPeriod,
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
        greetingMessage,
        auditionPrepRequirements,
        rehearsalInfo,
        castingInfo,
        musicDirector,
        choreographer,
        venue,
        rehearsalPeriod,
        // Update characters
        characters: {
          deleteMany: {}, // Delete existing characters
          create: characters?.map((char: any) => ({
            name: char.name,
            description: char.description,
            gender: char.gender || 'Any',
            ageRange: char.ageRange,
            notes: char.notes,
            category: char.category,
            vocalInfo: char.vocalInfo,
            auditionCut: char.auditionCut,
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
        // Update events
        // @ts-ignore - events relation exists in schema and runtime
        events: (
          events?.map((e: any) => e) || []
        ).length
          ? {
              deleteMany: {},
              create: events.map((e: any) => ({
                type: e.type,
                startAt: new Date(e.startAt),
                endAt: e.endAt ? new Date(e.endAt) : null,
                timezone: e.timezone || null,
                location: e.location || null,
                notes: e.notes || null,
              })),
            }
          : undefined,
      },
      include: {
        characters: true,
        auditionMaterials: true,
        _count: {
          select: {
            applicants: true,
            characters: true,
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
        greetingMessage: originalShow.greetingMessage,
        auditionPrepRequirements: originalShow.auditionPrepRequirements,
        rehearsalInfo: originalShow.rehearsalInfo,
        castingInfo: originalShow.castingInfo,
        musicDirector: originalShow.musicDirector,
        choreographer: originalShow.choreographer,
        venue: originalShow.venue,
        rehearsalPeriod: originalShow.rehearsalPeriod,
        characters: {
          create: originalShow.characters.map((char) => ({
            name: char.name,
            description: char.description,
            gender: char.gender,
            ageRange: char.ageRange,
            notes: char.notes,
            category: char.category,
            vocalInfo: char.vocalInfo,
            auditionCut: char.auditionCut,
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

// DELETE /api/shows - Delete a show by id (owner only)
export async function DELETE(request: NextRequest) {
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

    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'Missing required field: id' }, { status: 400 })

    const result = await prisma.show.deleteMany({ where: { id, userId } })
    if (result.count === 0) return NextResponse.json({ error: 'Show not found or access denied' }, { status: 404 })

    return NextResponse.json({ deleted: result.count })
  } catch (error) {
    console.error('Error deleting show:', error)
    return NextResponse.json({ error: 'Failed to delete show' }, { status: 500 })
  }
}