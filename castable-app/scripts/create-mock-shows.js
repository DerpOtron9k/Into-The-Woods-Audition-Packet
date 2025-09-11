// Create several realistic mock shows with characters and materials
// Usage: node scripts/create-mock-shows.js

require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      // Prefer DIRECT_URL (bypasses PgBouncer) to avoid prepared statement conflicts
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
})

async function getTargetUserId() {
  // Prefer the user who most recently created a show
  const recentShow = await prisma.show.findFirst({ orderBy: { createdAt: 'desc' } })
  if (recentShow) return recentShow.userId

  // Otherwise, use the first existing user
  const existingUser = await prisma.user.findFirst()
  if (existingUser) return existingUser.id

  // Finally, create a fallback user if none exist
  const fallback = await prisma.user.create({
    data: { id: 'mock-seed-user', email: 'seed@example.com' },
  })
  return fallback.id
}

function showsPayload(userId) {
  const now = new Date()
  const addDays = (n) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000)

  return [
    {
      title: 'A Midsummer Night’s Dream',
      description: 'Shakespeare’s whimsical comedy set in an enchanted forest full of fairies, lovers, and mischievous sprites.',
      director: 'Jordan Whitaker',
      organization: 'Elm Street Community Theater',
      auditionDate: addDays(10),
      deadline: addDays(7),
      location: '123 Elm St, Springfield',
      contactEmail: 'casting@elmtheater.org',
      contactPhone: '555-201-7373',
      status: 'active',
      userId,
      characters: [
        {
          name: 'Puck',
          description: 'A merry, mischievous fairy who serves Oberon and delights in pranks.',
          gender: 'Any',
          ageRange: '18-40',
          vocalRange: '',
          notes: 'High energy, physical comedy a plus.'
        },
        {
          name: 'Hermia',
          description: 'A strong-willed Athenian lover who defies her father’s wishes.',
          gender: 'Female',
          ageRange: '18-30',
          vocalRange: '',
          notes: 'Great comedic timing and emotional beats.'
        },
      ],
      auditionMaterials: [
        { type: 'script', fileName: 'Hermia_Side.pdf', fileUrl: 'https://example.com/auditions/hermia-side.pdf' },
      ],
    },
    {
      title: 'Newsies (Youth Edition)',
      description: 'The rousing tale of newsboys who strike in 1899 New York. High-energy ensemble show with dance emphasis.',
      director: 'Casey Lin',
      organization: 'Riverside Youth Players',
      auditionDate: addDays(14),
      deadline: addDays(12),
      location: '200 Riverside Ave, Riverton',
      contactEmail: 'auditions@riversideyouth.org',
      contactPhone: '555-333-8899',
      status: 'active',
      userId,
      characters: [
        {
          name: 'Jack Kelly',
          description: 'Charismatic leader of the newsboys. Strong singer and mover.',
          gender: 'Male',
          ageRange: '15-20',
          vocalRange: 'Tenor',
          notes: 'Comfortable with dialect and physical movement.'
        },
        {
          name: 'Katherine Plumber',
          description: 'A smart, independent reporter. Strong belt.',
          gender: 'Female',
          ageRange: '15-22',
          vocalRange: 'Mezzo-Soprano',
          notes: 'Stage presence and comic sensibility.'
        },
      ],
      auditionMaterials: [
        { type: 'music', fileName: 'Watch_What_Happens.mp3', fileUrl: 'https://example.com/auditions/watch-what-happens.mp3' },
        { type: 'script', fileName: 'Jack_Monologue.pdf', fileUrl: 'https://example.com/auditions/jack-monologue.pdf' },
      ],
    },
    {
      title: 'The Last Five Years (Concert Staging)',
      description: 'Two-person musical exploring a five-year relationship, told forwards and backwards.',
      director: 'Alex Monroe',
      organization: 'Harborlight Performing Arts',
      auditionDate: addDays(21),
      deadline: addDays(18),
      location: '49 Harborlight Blvd, Seaview',
      contactEmail: 'info@harborlightpa.org',
      contactPhone: '555-909-1111',
      status: 'active',
      userId,
      characters: [
        {
          name: 'Cathy Hiatt',
          description: 'An aspiring actress; expressive storyteller with strong belt.',
          gender: 'Female',
          ageRange: '20-35',
          vocalRange: 'Mezzo-Soprano',
          notes: 'Comfortable with sustained storytelling in song.'
        },
        {
          name: 'Jamie Wellerstein',
          description: 'A novelist; charisma and lyrical clarity required.',
          gender: 'Male',
          ageRange: '20-35',
          vocalRange: 'Tenor/Baritone',
          notes: 'Strong musical phrasing and emotional dynamics.'
        },
      ],
      auditionMaterials: [
        { type: 'music', fileName: 'Still_Hurting.pdf', fileUrl: 'https://example.com/auditions/still-hurting.pdf' },
        { type: 'music', fileName: 'Shiksa_Goddess.pdf', fileUrl: 'https://example.com/auditions/shiksa-goddess.pdf' },
      ],
    },
  ]
}

async function createShowWithChildren(payload) {
  return prisma.show.create({
    data: {
      title: payload.title,
      description: payload.description,
      director: payload.director,
      organization: payload.organization,
      auditionDate: payload.auditionDate,
      deadline: payload.deadline,
      location: payload.location,
      contactEmail: payload.contactEmail,
      contactPhone: payload.contactPhone,
      status: payload.status,
      userId: payload.userId,
      characters: {
        create: payload.characters.map((c) => ({
          name: c.name,
          description: c.description,
          gender: c.gender || 'Any',
          ageRange: c.ageRange || '',
          vocalRange: c.vocalRange || '',
          notes: c.notes || '',
        })),
      },
      auditionMaterials: {
        create: (payload.auditionMaterials || []).map((m) => ({
          type: m.type,
          fileName: m.fileName,
          fileUrl: m.fileUrl,
        })),
      },
    },
    include: { characters: true, auditionMaterials: true },
  })
}

async function main() {
  try {
    const userId = await getTargetUserId()
    const payloads = showsPayload(userId)

    for (const p of payloads) {
      const show = await createShowWithChildren(p)
      console.log('Created show:', show.title, show.id)
    }
  } catch (err) {
    console.error('Error seeding mock shows:', err)
    process.exitCode = 1
  } finally {
    await prisma.$disconnect()
  }
}

main()
