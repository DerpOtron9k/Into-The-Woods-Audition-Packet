// Create mock shows using the existing API endpoints
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';

const mockShows = [
  {
    title: "Into the Woods",
    description: "Stephen Sondheim's beloved musical that intertwines the plots of several Brothers Grimm fairy tales, exploring the consequences of the characters' wishes and quests. This Tony Award-winning musical combines humor, darkness, and beautiful music in a story about growing up and taking responsibility.",
    director: "Sarah Mitchell",
    organization: "Community Theater of Springfield",
    auditionDate: "2024-03-15T19:00:00Z",
    deadline: "2024-03-10T23:59:59Z",
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
    auditionDate: "2024-04-20T15:00:00Z",
    deadline: "2024-04-15T23:59:59Z",
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
  },
  {
    title: "The Crucible",
    description: "Arthur Miller's powerful drama about the Salem witch trials and the dangers of mass hysteria. Set in 1692 Massachusetts, the play explores themes of truth, justice, and the consequences of false accusations. A timely and relevant piece that examines the human cost of fear and intolerance.",
    director: "Amanda Lee",
    organization: "Independent Theater Company",
    auditionDate: "2024-05-10T19:30:00Z",
    deadline: "2024-05-05T23:59:59Z",
    location: "The Black Box Theater, 789 Arts District, Springfield, IL",
    contactEmail: "amanda.lee@independenttheater.org",
    contactPhone: "(555) 345-6789",
    status: "active",
    characters: [
      {
        name: "John Proctor",
        description: "A farmer and the central character of the play. He is a good man who has made mistakes but ultimately chooses to die rather than compromise his principles. Must be able to convey both strength and vulnerability, moral complexity and ultimate heroism.",
        gender: "Male",
        ageRange: "30-45",
        vocalRange: "Any",
        notes: "Lead role. Requires exceptional acting skills and ability to convey moral complexity. Must be comfortable with intense emotional scenes."
      },
      {
        name: "Elizabeth Proctor",
        description: "John Proctor's wife, a good and honest woman who has been hurt by her husband's infidelity but ultimately forgives him. Must be able to convey both strength and vulnerability, forgiveness and love.",
        gender: "Female",
        ageRange: "25-40",
        vocalRange: "Any",
        notes: "Lead role. Requires strong acting skills and ability to convey complex emotions. Must be comfortable with intense dramatic scenes."
      },
      {
        name: "Abigail Williams",
        description: "A young woman who was once John Proctor's servant and lover. She is manipulative, vengeful, and ultimately responsible for the witch trials. Must be able to convey both vulnerability and evil.",
        gender: "Female",
        ageRange: "17-25",
        vocalRange: "Any",
        notes: "Lead role. Requires exceptional acting skills and ability to convey both innocence and manipulation. Must be comfortable with intense emotional scenes."
      },
      {
        name: "Reverend Hale",
        description: "A minister from Beverly who is called to investigate the witchcraft accusations. He is initially confident but becomes increasingly troubled by the proceedings. Must be able to convey both authority and growing doubt.",
        gender: "Male",
        ageRange: "35-55",
        vocalRange: "Any",
        notes: "Principal role. Requires strong acting skills and ability to convey character growth. Must be comfortable with intense dramatic scenes."
      }
    ],
    auditionMaterials: [
      {
        type: "script",
        fileName: "Crucible_Audition_Sides.pdf",
        fileUrl: "https://castable-audition-files.s3.amazonaws.com/crucible/sides.pdf",
        fileSize: 2048000,
        mimeType: "application/pdf"
      },
      {
        type: "script",
        fileName: "Historical_Context.pdf",
        fileUrl: "https://castable-audition-files.s3.amazonaws.com/crucible/historical-context.pdf",
        fileSize: 1536000,
        mimeType: "application/pdf"
      }
    ]
  }
];

async function createMockShows() {
  try {
    console.log('Creating mock shows via API...\n');

    for (const showData of mockShows) {
      console.log(`Creating show: ${showData.title}`);
      
      // Create the show
      const response = await fetch(`${BASE_URL}/api/shows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(showData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Failed to create show ${showData.title}:`, errorText);
        continue;
      }

      const show = await response.json();
      console.log(`✅ Created show: ${show.title} (ID: ${show.id})`);
      console.log(`   - ${showData.characters.length} characters`);
      console.log(`   - ${showData.auditionMaterials.length} audition materials`);
      console.log(`   - Audition date: ${new Date(showData.auditionDate).toLocaleDateString()}`);
      console.log(`   - Deadline: ${new Date(showData.deadline).toLocaleDateString()}\n`);
    }

    console.log('🎉 All mock shows created successfully!');
    console.log('\nNext steps:');
    console.log('1. Test the shows by visiting the dashboard');
    console.log('2. Check the public audition pages');
    console.log('3. Verify all characters and audition materials were created');

  } catch (error) {
    console.error('❌ Error creating mock shows:', error.message);
  }
}

createMockShows();
