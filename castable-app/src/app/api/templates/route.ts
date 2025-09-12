import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/templates - Get all templates for the current user
export async function GET() {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const templates = await prisma.showTemplate.findMany({
      where: { userId },
      include: {
        characters: true,
        auditionMaterials: true,
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
  }
}

// POST /api/templates - Create a new template
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      description,
      title,
      showDescription,
      director,
      organization,
      location,
      contactEmail,
      contactPhone,
      characters = [],
      auditionMaterials = []
    } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: 'Template name is required' }, { status: 400 })
    }

    // Create template
    const template = await prisma.showTemplate.create({
      data: {
        name,
        description,
        title,
        showDescription,
        director,
        organization,
        location,
        contactEmail,
        contactPhone,
        userId,
        characters: {
          create: characters.map((char: any) => ({
            name: char.name,
            description: char.description,
            gender: char.gender || 'Any',
            ageRange: char.ageRange,
            vocalRange: char.vocalRange,
            notes: char.notes,
          }))
        },
        auditionMaterials: {
          create: auditionMaterials.map((material: any) => ({
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
      }
    })

    return NextResponse.json({ template }, { status: 201 })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 })
  }
}


