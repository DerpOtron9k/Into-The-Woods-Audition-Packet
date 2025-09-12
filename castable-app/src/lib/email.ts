interface SendEmailInput {
  to: string
  subject: string
  html: string
  from?: string
}

interface EmailResult {
  ok: boolean
  id?: string
  error?: string
}

function escapeHtml(input: string | null | undefined): string {
  if (!input) return ''
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function sendEmail({ to, subject, html, from }: SendEmailInput): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY
  const defaultFrom = process.env.EMAIL_FROM || 'Castable <no-reply@castable.actor>'

  if (!apiKey) {
    console.warn('sendEmail: RESEND_API_KEY not set, skipping email send')
    return { ok: false, error: 'RESEND_API_KEY not set' }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: from || defaultFrom,
        to,
        subject,
        html,
      }),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error('sendEmail: provider error', res.status, text)
      return { ok: false, error: `Provider error ${res.status}` }
    }
    const data = await res.json().catch(() => ({}))
    return { ok: true, id: data?.id }
  } catch (err) {
    console.error('sendEmail: unexpected error', err)
    return { ok: false, error: 'Unexpected error' }
  }
}

interface ApplicantEmailPayload {
  applicant: {
    name: string
    email: string
    phone?: string | null
    headshotUrl?: string | null
    resumeUrl?: string | null
    auditionVideoUrl?: string | null
    selectedRoles?: string[]
    experience?: string
    availability?: string
    additionalNotes?: string
  }
  show: {
    title: string
    director?: string | null
    contactEmail?: string | null
  }
}

export async function sendApplicantConfirmationEmail(payload: ApplicantEmailPayload) {
  const { applicant, show } = payload
  const subject = `We received your application for ${show.title}`
  const html = `
    <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;color:#0f172a">
      <h2 style="margin:0 0 12px 0">Thanks, ${escapeHtml(applicant.name)}</h2>
      <p>Your application for <strong>${escapeHtml(show.title)}</strong> has been received.</p>
      <p>We'll review your materials and reach out if we need anything else.</p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0" />
      <p style="font-size:12px;color:#64748b">If you have questions, contact the production at ${escapeHtml(show.contactEmail || '')}.</p>
    </div>
  `
  return sendEmail({ to: applicant.email, subject, html })
}

export async function sendDirectorNotificationEmail(payload: ApplicantEmailPayload) {
  const { applicant, show } = payload
  const to = show.contactEmail
  if (!to) return { ok: false, error: 'No director contactEmail' }

  const subject = `New application: ${applicant.name} → ${show.title}`
  const roles = (applicant.selectedRoles || []).map(r => `<code style="padding:2px 6px;background:#f1f5f9;border-radius:4px">${escapeHtml(r)}</code>`).join(' ')
  const html = `
    <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;color:#0f172a">
      <h2 style="margin:0 0 12px 0">New Applicant</h2>
      <p><strong>${escapeHtml(applicant.name)}</strong> submitted an application for <strong>${escapeHtml(show.title)}</strong>.</p>
      <ul style="padding-left:16px">
        <li>Email: <a href="mailto:${escapeHtml(applicant.email)}">${escapeHtml(applicant.email)}</a></li>
        <li>Phone: ${escapeHtml(applicant.phone || '-')}
        <li>Roles: ${roles || '-'}</li>
      </ul>
      <p><strong>Links</strong></p>
      <ul style="padding-left:16px">
        <li>Headshot: ${applicant.headshotUrl ? `<a href="${escapeHtml(applicant.headshotUrl)}">View</a>` : '-'}</li>
        <li>Resume: ${applicant.resumeUrl ? `<a href="${escapeHtml(applicant.resumeUrl)}">View</a>` : '-'}</li>
        <li>Video: ${applicant.auditionVideoUrl ? `<a href="${escapeHtml(applicant.auditionVideoUrl)}">View</a>` : '-'}</li>
      </ul>
      <p><strong>Experience</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(applicant.experience || '')}</p>
      <p><strong>Availability</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(applicant.availability || '')}</p>
      <p><strong>Notes</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(applicant.additionalNotes || '')}</p>
    </div>
  `
  return sendEmail({ to, subject, html })
}



