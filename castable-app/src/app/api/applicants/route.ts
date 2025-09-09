import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/applicants - Create a new applicant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Creating applicant...', body)
    
    const {
      showId,
      name,
      email,
      phone,
      selectedRoles,
      experience,
      availability,
      additionalNotes,
      headshotUrl,
      resumeUrl,
      auditionVideoUrl
    } = body

    // Validate required fields
    if (!showId || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: showId, name, email' },
        { status: 400 }
      )
    }

    // Check if show exists and is active
    const show = await prisma.show.findUnique({
      where: { 
        id: showId,
        status: 'active'
      }
    })

    if (!show) {
      return NextResponse.json(
        { error: 'Show not found or not accepting applications' },
        { status: 404 }
      )
    }

    // Check if deadline has passed
    if (show.deadline && new Date(show.deadline) < new Date()) {
      return NextResponse.json(
        { error: 'Application deadline has passed' },
        { status: 400 }
      )
    }

    // Create the applicant
    const applicant = await prisma.applicant.create({
      data: {
        name,
        email,
        phone,
        headshotUrl,
        resumeUrl,
        auditionFileUrl: auditionVideoUrl,
        showId,
        // Store additional data in notes for now
        // TODO: Add proper fields for experience, availability, selectedRoles, additionalNotes
      },
      include: {
        show: {
          select: {
            title: true,
            director: true,
            contactEmail: true
          }
        }
      }
    })

    console.log('Applicant created successfully:', applicant.id)
    
    // TODO: Send confirmation email
    // TODO: Notify director of new application
    
    return NextResponse.json({ 
      applicant,
      message: 'Application submitted successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating applicant:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create applicant',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET /api/applicants - Get applicants for a show (protected)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const showId = searchParams.get('showId')
    
    if (!showId) {
      return NextResponse.json(
        { error: 'Show ID is required' },
        { status: 400 }
      )
    }

    // TODO: Add authentication check
    // const { userId } = await auth()
    // if (!userId) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const applicants = await prisma.applicant.findMany({
      where: { showId },
      orderBy: { createdAt: 'desc' },
      include: {
        show: {
          select: {
            title: true,
            userId: true
          }
        }
      }
    })

    return NextResponse.json({ applicants })
  } catch (error) {
    console.error('Error fetching applicants:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applicants' },
      { status: 500 }
    )
  }
}
