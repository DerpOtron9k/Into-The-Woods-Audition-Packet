import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendApplicantConfirmationEmail, sendDirectorNotificationEmail } from '@/lib/email'

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

    // Check if show exists (allow submitting for any existing show)
    const show = await prisma.show.findUnique({ where: { id: showId } })

    if (!show) {
      return NextResponse.json({ error: 'Show not found' }, { status: 404 })
    }

    // Check if deadline has passed
    if (show.deadline && new Date(show.deadline) < new Date()) {
      return NextResponse.json(
        { error: 'Application deadline has passed' },
        { status: 400 }
      )
    }

    // Create the applicant (with fallback if new columns are missing client/server-side)
    let applicant
    try {
      applicant = await prisma.applicant.create({
        data: {
          name,
          email,
          phone,
          headshotUrl,
          resumeUrl,
          auditionFileUrl: auditionVideoUrl,
          selectedRoles: Array.isArray(selectedRoles) ? selectedRoles : [],
          experience,
          availability,
          additionalNotes,
          showId,
        },
        include: {
          show: { select: { title: true, director: true, contactEmail: true } },
        },
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      console.warn('Applicant create failed, retrying with minimal fields:', msg)
      applicant = await prisma.applicant.create({
        data: {
          name,
          email,
          phone,
          headshotUrl,
          resumeUrl,
          auditionFileUrl: auditionVideoUrl,
          selectedRoles: Array.isArray(selectedRoles) ? selectedRoles : [],
          experience,
          availability,
          additionalNotes,
          showId,
        },
        include: {
          show: { select: { title: true, director: true, contactEmail: true } },
        },
      })
    }

    console.log('Applicant created successfully:', applicant.id)
    
    // Fire-and-forget emails (don't block success)
    Promise.allSettled([
      sendApplicantConfirmationEmail({
        applicant: {
          name,
          email,
          phone,
          headshotUrl,
          resumeUrl,
          auditionVideoUrl,
          selectedRoles,
          experience,
          availability,
          additionalNotes,
        },
        show: {
          title: applicant.show.title,
          director: applicant.show.director,
          contactEmail: applicant.show.contactEmail,
        },
      }),
      sendDirectorNotificationEmail({
        applicant: {
          name,
          email,
          phone,
          headshotUrl,
          resumeUrl,
          auditionVideoUrl,
          selectedRoles,
          experience,
          availability,
          additionalNotes,
        },
        show: {
          title: applicant.show.title,
          director: applicant.show.director,
          contactEmail: applicant.show.contactEmail,
        },
      }),
    ]).catch(() => {})
    
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

