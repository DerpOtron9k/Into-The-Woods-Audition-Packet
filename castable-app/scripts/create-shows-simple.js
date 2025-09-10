// Simple script to create mock shows using direct SQL
const { Pool } = require('pg');

// Create a new connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createMockShows() {
  const client = await pool.connect();
  
  try {
    console.log('Creating mock shows...\n');

    // First, find the user by email
    const userResult = await client.query(
      'SELECT id, email FROM "User" WHERE email = $1',
      ['Staheli.Andrew.G@gmail.com']
    );

    if (userResult.rows.length === 0) {
      console.error('❌ User with email Staheli.Andrew.G@gmail.com not found');
      return;
    }

    const user = userResult.rows[0];
    console.log(`✅ Found user: ${user.email} (ID: ${user.id})\n`);

    const shows = [
      {
        title: "Into the Woods",
        description: "Stephen Sondheim's beloved musical that intertwines the plots of several Brothers Grimm fairy tales, exploring the consequences of the characters' wishes and quests. This Tony Award-winning musical combines humor, darkness, and beautiful music in a story about growing up and taking responsibility.",
        director: "Sarah Mitchell",
        organization: "Community Theater of Springfield",
        auditionDate: new Date('2024-03-15T19:00:00Z'),
        deadline: new Date('2024-03-10T23:59:59Z'),
        location: "Springfield Community Center, 123 Main St, Springfield, IL",
        contactEmail: "sarah.mitchell@springfieldtheater.org",
        contactPhone: "(555) 123-4567",
        status: "active",
        characters: [
          {
            name: "The Baker",
            description: "A kind-hearted but somewhat bumbling baker who desperately wants a child. He embarks on a quest to break the curse that has left him and his wife childless. Must be able to convey both comedy and genuine emotion. Strong baritone voice required.",
            gender: "Male",
            ageRange: "25-40",
            vocalRange: "Baritone (A2-F4)",
            notes: "Lead role. Must be comfortable with complex Sondheim lyrics and rhythms. Some physical comedy required."
          },
          {
            name: "The Baker's Wife",
            description: "The Baker's determined and practical wife who joins him on his quest. She is more assertive than her husband and often takes the lead in their adventures. Must have excellent comedic timing and strong acting skills.",
            gender: "Female",
            ageRange: "25-40",
            vocalRange: "Mezzo-Soprano (G3-A5)",
            notes: "Lead role. Requires strong character work and chemistry with The Baker. Some dance required."
          },
          {
            name: "Cinderella",
            description: "The classic fairy tale character who wishes to go to the King's Festival. She is kind, gentle, and ultimately learns to make her own choices. Must have a pure, innocent quality with underlying strength.",
            gender: "Female",
            ageRange: "18-30",
            vocalRange: "Soprano (C4-F6)",
            notes: "Principal role. Must be able to sing 'On the Steps of the Palace' - one of Sondheim's most challenging songs. Some dance required."
          },
          {
            name: "Little Red Riding Hood",
            description: "A naive but spunky young girl who learns to be more cautious after her encounter with the Wolf. Must be able to play both innocence and growing wisdom. Strong comedic timing essential.",
            gender: "Female",
            ageRange: "16-25",
            vocalRange: "Soprano (C4-G5)",
            notes: "Principal role. Requires excellent comedic skills and ability to work with puppets (the Wolf). Must be comfortable with physical comedy."
          },
          {
            name: "Jack (of Beanstalk fame)",
            description: "A simple, good-natured young man who trades his cow for magic beans. He is naive but ultimately brave and loyal. Must have a natural, unaffected quality.",
            gender: "Male",
            ageRange: "18-30",
            vocalRange: "Tenor (C3-G4)",
            notes: "Principal role. Must be able to convey both simplicity and growth. Some physical comedy and interaction with giant puppet required."
          }
        ],
        auditionMaterials: [
          {
            type: "script",
            fileName: "Into_the_Woods_Sides.pdf",
            fileUrl: "https://castable-audition-files.s3.amazonaws.com/into-the-woods/sides.pdf",
            fileSize: 2048576,
            mimeType: "application/pdf"
          },
          {
            type: "music",
            fileName: "Into_the_Woods_Vocal_Selections.mp3",
            fileUrl: "https://castable-audition-files.s3.amazonaws.com/into-the-woods/vocal-selections.mp3",
            fileSize: 15728640,
            mimeType: "audio/mpeg"
          }
        ]
      },
      {
        title: "A Midsummer Night's Dream",
        description: "Shakespeare's beloved comedy about love, magic, and the transformative power of the imagination. Set in an enchanted forest, the play follows four young lovers, a group of amateur actors, and the fairy kingdom as their worlds collide in a night of magic and mayhem.",
        director: "Michael Johnson",
        organization: "Springfield High School Drama Department",
        auditionDate: new Date('2024-04-20T15:00:00Z'),
        deadline: new Date('2024-04-15T23:59:59Z'),
        location: "Springfield High School Auditorium, 456 School St, Springfield, IL",
        contactEmail: "michael.johnson@springfield.edu",
        contactPhone: "(555) 234-5678",
        status: "active",
        characters: [
          {
            name: "Hermia",
            description: "A young woman in love with Lysander but promised to Demetrius by her father. She is strong-willed, passionate, and determined to follow her heart. Must be able to convey both vulnerability and strength.",
            gender: "Female",
            ageRange: "16-25",
            vocalRange: "Any",
            notes: "Lead role. Requires strong Shakespearean acting skills and ability to work with verse. Some physical comedy required."
          },
          {
            name: "Helena",
            description: "Hermia's best friend who is desperately in love with Demetrius. She is insecure, self-deprecating, but ultimately loyal. Must be able to play both comedy and pathos.",
            gender: "Female",
            ageRange: "16-25",
            vocalRange: "Any",
            notes: "Lead role. Requires excellent comedic timing and ability to work with Shakespearean verse. Must be comfortable with physical comedy."
          },
          {
            name: "Lysander",
            description: "A young man in love with Hermia. He is romantic, determined, and willing to fight for his love. Must be able to convey both passion and humor.",
            gender: "Male",
            ageRange: "16-25",
            vocalRange: "Any",
            notes: "Lead role. Requires strong Shakespearean acting skills and ability to work with verse. Some physical comedy required."
          },
          {
            name: "Demetrius",
            description: "A young man who is initially in love with Hermia but later falls in love with Helena. He is somewhat arrogant but ultimately redeemable. Must be able to play both villain and hero.",
            gender: "Male",
            ageRange: "16-25",
            vocalRange: "Any",
            notes: "Lead role. Requires strong Shakespearean acting skills and ability to work with verse. Must be able to convey character growth."
          },
          {
            name: "Puck",
            description: "Oberon's mischievous servant. He is playful, energetic, and the source of much of the play's comedy. Must be able to play both comedy and pathos.",
            gender: "Any",
            ageRange: "16-30",
            vocalRange: "Any",
            notes: "Principal role. Requires excellent physical comedy skills and ability to work with verse. Must be comfortable with acrobatics."
          }
        ],
        auditionMaterials: [
          {
            type: "script",
            fileName: "Midsummer_Audition_Sides.pdf",
            fileUrl: "https://castable-audition-files.s3.amazonaws.com/midsummer/sides.pdf",
            fileSize: 1536000,
            mimeType: "application/pdf"
          },
          {
            type: "script",
            fileName: "Character_Guide.pdf",
            fileUrl: "https://castable-audition-files.s3.amazonaws.com/midsummer/character-guide.pdf",
            fileSize: 1024000,
            mimeType: "application/pdf"
          }
        ]
      }
    ];

    for (const showData of shows) {
      console.log(`Creating show: ${showData.title}`);
      
      // Insert the show
      const showResult = await client.query(`
        INSERT INTO "Show" (id, title, description, director, organization, "auditionDate", deadline, location, "contactEmail", "contactPhone", status, "userId", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING id
      `, [
        `show_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        showData.title,
        showData.description,
        showData.director,
        showData.organization,
        showData.auditionDate,
        showData.deadline,
        showData.location,
        showData.contactEmail,
        showData.contactPhone,
        showData.status,
        user.id,
        new Date(),
        new Date()
      ]);

      const showId = showResult.rows[0].id;

      // Insert characters
      for (const character of showData.characters) {
        await client.query(`
          INSERT INTO "Character" (id, name, description, gender, "ageRange", "vocalRange", notes, "showId", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          character.name,
          character.description,
          character.gender,
          character.ageRange,
          character.vocalRange,
          character.notes,
          showId,
          new Date(),
          new Date()
        ]);
      }

      // Insert audition materials
      for (const material of showData.auditionMaterials) {
        await client.query(`
          INSERT INTO "AuditionMaterial" (id, type, "fileName", "fileUrl", "fileSize", "mimeType", "showId", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          `mat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          material.type,
          material.fileName,
          material.fileUrl,
          material.fileSize,
          material.mimeType,
          showId,
          new Date(),
          new Date()
        ]);
      }

      console.log(`✅ Created show: ${showData.title} (ID: ${showId})`);
      console.log(`   - ${showData.characters.length} characters`);
      console.log(`   - ${showData.auditionMaterials.length} audition materials`);
      console.log(`   - Audition date: ${showData.auditionDate.toLocaleDateString()}`);
      console.log(`   - Deadline: ${showData.deadline.toLocaleDateString()}\n`);
    }

    console.log('🎉 All mock shows created successfully!');

  } catch (error) {
    console.error('❌ Error creating mock shows:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

createMockShows();
