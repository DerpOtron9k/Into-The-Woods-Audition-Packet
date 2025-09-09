import { NextRequest, NextResponse } from 'next/server'
import { auth } from "@clerk/nextjs/server"
import { prisma } from '@/lib/prisma'

// GET /api/shows - Get all shows for authenticated user
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
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
    const { userId } = await auth()
    
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

    // Generate public URL
    const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/shows/${crypto.randomUUID()}`

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
        publicUrl: publicUrl,
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
      publicUrl: show.publicUrl 
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