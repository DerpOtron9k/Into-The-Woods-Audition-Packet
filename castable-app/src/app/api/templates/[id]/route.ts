import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/templates/[id] - Get a specific template
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const template = await prisma.showTemplate.findFirst({
      where: { 
        id,
        userId 
      },
      include: {
        characters: true,
        auditionMaterials: true,
      }
    })

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    return NextResponse.json({ template })
  } catch (error) {
    console.error('Error fetching template:', error)
    return NextResponse.json({ error: 'Failed to fetch template' }, { status: 500 })
  }
}

// PUT /api/templates/[id] - Update a template
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Check if template exists and belongs to user
    const existingTemplate = await prisma.showTemplate.findFirst({
      where: { 
        id,
        userId 
      }
    })

    if (!existingTemplate) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Update template
    const template = await prisma.showTemplate.update({
      where: { id },
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
        // Update characters
        characters: {
          deleteMany: {}, // Delete existing characters
          create: characters.map((char: any) => ({
            name: char.name,
            description: char.description,
            gender: char.gender || 'Any',
            ageRange: char.ageRange,
            vocalRange: char.vocalRange,
            notes: char.notes,
          }))
        },
        // Update audition materials
        auditionMaterials: {
          deleteMany: {}, // Delete existing materials
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

    return NextResponse.json({ template })
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 })
  }
}

// DELETE /api/templates/[id] - Delete a template
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if template exists and belongs to user
    const existingTemplate = await prisma.showTemplate.findFirst({
      where: { 
        id,
        userId 
      }
    })

    if (!existingTemplate) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Delete template (cascade will delete characters and materials)
    await prisma.showTemplate.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Template deleted successfully' })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 })
  }
}

