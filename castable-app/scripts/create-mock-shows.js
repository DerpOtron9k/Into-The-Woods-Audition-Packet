const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Use the existing user email to find their ID
const USER_EMAIL = 'Staheli.Andrew.G@gmail.com';

const mockShows = [
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
      },
      {
        name: "The Witch",
        description: "A powerful but lonely witch who has been cursed with ugliness. She is complex - both villain and victim. Must be able to convey both menace and vulnerability. Requires strong acting and vocal skills.",
        gender: "Female",
        ageRange: "30-50",
        vocalRange: "Alto/Soprano (F3-F6)",
        notes: "Lead role. One of the most vocally demanding roles in musical theater. Must be able to sing 'Stay With Me' and 'Last Midnight' with emotional depth."
      },
      {
        name: "Cinderella's Prince",
        description: "A charming but ultimately unfaithful prince who falls in love with Cinderella. Must be able to play both romantic and comedic aspects. Requires strong vocal skills and stage presence.",
        gender: "Male",
        ageRange: "25-35",
        vocalRange: "Tenor (C3-A4)",
        notes: "Principal role. Must be able to sing 'Agony' - a challenging duet. Requires strong comedic timing and chemistry with Rapunzel's Prince."
      },
      {
        name: "Rapunzel's Prince",
        description: "Cinderella's Prince's brother, also charming but unfaithful. Must be able to work closely with Cinderella's Prince in comedic scenes. Requires strong vocal and acting skills.",
        gender: "Male",
        ageRange: "25-35",
        vocalRange: "Tenor (C3-A4)",
        notes: "Principal role. Must be able to sing 'Agony' duet. Requires strong comedic timing and chemistry with Cinderella's Prince."
      },
      {
        name: "The Wolf",
        description: "A seductive and dangerous predator who preys on Little Red Riding Hood. Must be able to convey both charm and menace. Requires strong physicality and vocal skills.",
        gender: "Male",
        ageRange: "25-40",
        vocalRange: "Baritone (F2-D4)",
        notes: "Supporting role. Requires strong physical presence and ability to work with puppetry. Must be comfortable with suggestive material."
      },
      {
        name: "Cinderella's Stepmother",
        description: "A cruel and manipulative woman who mistreats Cinderella. Must be able to play villainy with comedic flair. Requires strong character work and vocal skills.",
        gender: "Female",
        ageRange: "40-60",
        vocalRange: "Alto (F3-D5)",
        notes: "Supporting role. Must be able to convey both cruelty and comedy. Some dance required."
      },
      {
        name: "Florinda",
        description: "One of Cinderella's stepsisters. Vain and silly, but not entirely without heart. Must be able to play comedy and work well in ensemble scenes.",
        gender: "Female",
        ageRange: "20-35",
        vocalRange: "Alto (F3-D5)",
        notes: "Supporting role. Must be able to work well in ensemble and have strong comedic timing."
      },
      {
        name: "Lucinda",
        description: "Cinderella's other stepsister. Similar to Florinda but with her own distinct personality. Must be able to play comedy and work well in ensemble scenes.",
        gender: "Female",
        ageRange: "20-35",
        vocalRange: "Alto (F3-D5)",
        notes: "Supporting role. Must be able to work well in ensemble and have strong comedic timing."
      },
      {
        name: "Cinderella's Father",
        description: "A kind but weak-willed man who is dominated by his second wife. Must be able to convey both love for Cinderella and inability to protect her.",
        gender: "Male",
        ageRange: "45-65",
        vocalRange: "Baritone (F2-D4)",
        notes: "Supporting role. Requires strong character work and ability to convey internal conflict."
      },
      {
        name: "The Narrator",
        description: "The storyteller who guides the audience through the tale. Must be able to engage the audience and provide exposition clearly. Requires strong vocal projection and stage presence.",
        gender: "Any",
        ageRange: "30-60",
        vocalRange: "Any",
        notes: "Principal role. Must have excellent diction and stage presence. Requires ability to work with the audience and provide clear exposition."
      },
      {
        name: "Mysterious Man",
        description: "A mysterious figure who appears throughout the story, ultimately revealed to be the Baker's father. Must be able to convey mystery and ultimately warmth. Requires strong acting skills.",
        gender: "Male",
        ageRange: "50-70",
        vocalRange: "Baritone (F2-D4)",
        notes: "Supporting role. Requires strong character work and ability to convey both mystery and paternal love."
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
      },
      {
        type: "script",
        fileName: "Character_Descriptions.pdf",
        fileUrl: "https://castable-audition-files.s3.amazonaws.com/into-the-woods/character-descriptions.pdf",
        fileSize: 1024000,
        mimeType: "application/pdf"
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
        name: "Oberon",
        description: "The King of the Fairies. He is powerful, mischievous, and ultimately benevolent. Must be able to convey both authority and playfulness.",
        gender: "Male",
        ageRange: "25-45",
        vocalRange: "Any",
        notes: "Principal role. Requires strong stage presence and ability to work with verse. Some physicality required."
      },
      {
        name: "Titania",
        description: "The Queen of the Fairies. She is regal, beautiful, and ultimately loving. Must be able to convey both majesty and vulnerability.",
        gender: "Female",
        ageRange: "25-45",
        vocalRange: "Any",
        notes: "Principal role. Requires strong stage presence and ability to work with verse. Some dance may be required."
      },
      {
        name: "Puck",
        description: "Oberon's mischievous servant. He is playful, energetic, and the source of much of the play's comedy. Must be able to play both comedy and pathos.",
        gender: "Any",
        ageRange: "16-30",
        vocalRange: "Any",
        notes: "Principal role. Requires excellent physical comedy skills and ability to work with verse. Must be comfortable with acrobatics."
      },
      {
        name: "Bottom",
        description: "A weaver and amateur actor who is transformed into an ass. He is pompous, self-important, but ultimately lovable. Must be able to play broad comedy.",
        gender: "Male",
        ageRange: "25-50",
        vocalRange: "Any",
        notes: "Principal role. Requires excellent comedic skills and ability to work with verse. Must be comfortable with physical comedy and transformation."
      },
      {
        name: "Quince",
        description: "A carpenter and the director of the amateur acting troupe. He is practical, organized, and often frustrated by his actors. Must be able to play both comedy and authority.",
        gender: "Male",
        ageRange: "30-50",
        vocalRange: "Any",
        notes: "Supporting role. Requires strong character work and ability to work with verse. Must be able to play authority figure."
      },
      {
        name: "Flute",
        description: "A bellows-mender who plays Thisbe in the play-within-a-play. He is young, eager, and often the target of jokes. Must be able to play both comedy and sincerity.",
        gender: "Male",
        ageRange: "16-25",
        vocalRange: "Any",
        notes: "Supporting role. Requires strong comedic skills and ability to work with verse. Must be comfortable with cross-dressing."
      },
      {
        name: "Snug",
        description: "A joiner who plays the Lion in the play-within-a-play. He is slow-witted but good-natured. Must be able to play broad comedy.",
        gender: "Male",
        ageRange: "25-45",
        vocalRange: "Any",
        notes: "Supporting role. Requires strong comedic skills and ability to work with verse. Must be comfortable with physical comedy."
      },
      {
        name: "Snout",
        description: "A tinker who plays the Wall in the play-within-a-play. He is practical and often confused. Must be able to play both comedy and sincerity.",
        gender: "Male",
        ageRange: "25-45",
        vocalRange: "Any",
        notes: "Supporting role. Requires strong comedic skills and ability to work with verse. Must be comfortable with physical comedy."
      },
      {
        name: "Starveling",
        description: "A tailor who plays Moonshine in the play-within-a-play. He is nervous and often the target of jokes. Must be able to play both comedy and pathos.",
        gender: "Male",
        ageRange: "25-45",
        vocalRange: "Any",
        notes: "Supporting role. Requires strong comedic skills and ability to work with verse. Must be comfortable with physical comedy."
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
      },
      {
        type: "video",
        fileName: "Production_Concept_Video.mp4",
        fileUrl: "https://castable-audition-files.s3.amazonaws.com/midsummer/concept-video.mp4",
        fileSize: 52428800,
        mimeType: "video/mp4"
      }
    ]
  },
  {
    title: "The Crucible",
    description: "Arthur Miller's powerful drama about the Salem witch trials and the dangers of mass hysteria. Set in 1692 Massachusetts, the play explores themes of truth, justice, and the consequences of false accusations. A timely and relevant piece that examines the human cost of fear and intolerance.",
    director: "Amanda Lee",
    organization: "Independent Theater Company",
    auditionDate: new Date('2024-05-10T19:30:00Z'),
    deadline: new Date('2024-05-05T23:59:59Z'),
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
      },
      {
        name: "Deputy Governor Danforth",
        description: "The presiding judge at the witch trials. He is rigid, self-righteous, and unwilling to admit he might be wrong. Must be able to convey both authority and moral blindness.",
        gender: "Male",
        ageRange: "45-65",
        vocalRange: "Any",
        notes: "Principal role. Requires strong acting skills and ability to convey both authority and moral blindness. Must be comfortable with intense dramatic scenes."
      },
      {
        name: "Reverend Parris",
        description: "The minister of Salem who is more concerned with his reputation than with truth. He is paranoid, self-serving, and ultimately responsible for the hysteria. Must be able to convey both authority and moral weakness.",
        gender: "Male",
        ageRange: "40-60",
        vocalRange: "Any",
        notes: "Principal role. Requires strong acting skills and ability to convey both authority and moral weakness. Must be comfortable with intense dramatic scenes."
      },
      {
        name: "Mary Warren",
        description: "A young woman who works for the Proctors and becomes involved in the witch trials. She is weak-willed and easily manipulated. Must be able to convey both innocence and complicity.",
        gender: "Female",
        ageRange: "16-25",
        vocalRange: "Any",
        notes: "Supporting role. Requires strong acting skills and ability to convey both innocence and complicity. Must be comfortable with intense emotional scenes."
      },
      {
        name: "Giles Corey",
        description: "An elderly farmer who is outspoken and ultimately pays the price for his principles. He is gruff, honest, and ultimately heroic. Must be able to convey both humor and heroism.",
        gender: "Male",
        ageRange: "60-80",
        vocalRange: "Any",
        notes: "Supporting role. Requires strong acting skills and ability to convey both humor and heroism. Must be comfortable with intense dramatic scenes."
      },
      {
        name: "Rebecca Nurse",
        description: "An elderly woman who is respected in the community but ultimately accused of witchcraft. She is wise, kind, and ultimately heroic. Must be able to convey both wisdom and strength.",
        gender: "Female",
        ageRange: "60-80",
        vocalRange: "Any",
        notes: "Supporting role. Requires strong acting skills and ability to convey both wisdom and strength. Must be comfortable with intense dramatic scenes."
      },
      {
        name: "Judge Hathorne",
        description: "A judge at the witch trials who is rigid and unsympathetic. He is more concerned with maintaining order than with justice. Must be able to convey both authority and moral blindness.",
        gender: "Male",
        ageRange: "40-60",
        vocalRange: "Any",
        notes: "Supporting role. Requires strong acting skills and ability to convey both authority and moral blindness. Must be comfortable with intense dramatic scenes."
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
      },
      {
        type: "script",
        fileName: "Character_Analysis.pdf",
        fileUrl: "https://castable-audition-files.s3.amazonaws.com/crucible/character-analysis.pdf",
        fileSize: 1024000,
        mimeType: "application/pdf"
      }
    ]
  },
  {
    title: "The Addams Family",
    description: "A musical comedy based on the beloved Addams Family characters. The story follows Wednesday Addams as she falls in love with a 'normal' boy and invites his family to dinner, much to the dismay of her eccentric family. A fun, spooky, and heartwarming musical that celebrates being different.",
    director: "David Rodriguez",
    organization: "Springfield Community Players",
    auditionDate: new Date('2024-06-15T14:00:00Z'),
    deadline: new Date('2024-06-10T23:59:59Z'),
    location: "Springfield Community Players Theater, 321 Theater St, Springfield, IL",
    contactEmail: "david.rodriguez@springfieldplayers.org",
    contactPhone: "(555) 456-7890",
    status: "active",
    characters: [
      {
        name: "Gomez Addams",
        description: "The patriarch of the Addams family. He is charming, passionate, and deeply in love with his wife Morticia. Must be able to convey both comedy and romance, with a strong baritone voice and excellent comedic timing.",
        gender: "Male",
        ageRange: "35-50",
        vocalRange: "Baritone (A2-F4)",
        notes: "Lead role. Requires strong vocal skills and excellent comedic timing. Must be comfortable with physical comedy and romance."
      },
      {
        name: "Morticia Addams",
        description: "The matriarch of the Addams family. She is elegant, mysterious, and deeply in love with her husband Gomez. Must be able to convey both comedy and romance, with a strong mezzo-soprano voice and excellent comedic timing.",
        gender: "Female",
        ageRange: "30-45",
        vocalRange: "Mezzo-Soprano (G3-A5)",
        notes: "Lead role. Requires strong vocal skills and excellent comedic timing. Must be comfortable with physical comedy and romance. Some dance required."
      },
      {
        name: "Wednesday Addams",
        description: "The Addams' daughter who falls in love with a 'normal' boy. She is dark, mysterious, but ultimately capable of love. Must be able to convey both comedy and romance, with a strong mezzo-soprano voice.",
        gender: "Female",
        ageRange: "18-25",
        vocalRange: "Mezzo-Soprano (G3-A5)",
        notes: "Lead role. Requires strong vocal skills and excellent comedic timing. Must be comfortable with both comedy and romance."
      },
      {
        name: "Lucas Beineke",
        description: "Wednesday's love interest, a 'normal' boy from Ohio. He is sweet, innocent, but ultimately brave enough to stand up to his parents. Must be able to convey both comedy and romance, with a strong tenor voice.",
        gender: "Male",
        ageRange: "18-25",
        vocalRange: "Tenor (C3-G4)",
        notes: "Lead role. Requires strong vocal skills and excellent comedic timing. Must be comfortable with both comedy and romance."
      },
      {
        name: "Fester Addams",
        description: "Gomez's eccentric uncle who is in love with the moon. He is the narrator of the story and provides much of the comedy. Must be able to convey both comedy and pathos, with a strong tenor voice.",
        gender: "Male",
        ageRange: "30-50",
        vocalRange: "Tenor (C3-G4)",
        notes: "Principal role. Requires strong vocal skills and excellent comedic timing. Must be comfortable with physical comedy and audience interaction."
      },
      {
        name: "Grandmama Addams",
        description: "Gomez's mother, a witch who provides comic relief. She is feisty, funny, and ultimately loving. Must be able to convey both comedy and warmth, with a strong mezzo-soprano voice.",
        gender: "Female",
        ageRange: "50-70",
        vocalRange: "Mezzo-Soprano (G3-A5)",
        notes: "Principal role. Requires strong vocal skills and excellent comedic timing. Must be comfortable with physical comedy."
      },
      {
        name: "Pugsley Addams",
        description: "Wednesday's younger brother who is worried about losing his sister. He is mischievous, loving, and ultimately supportive. Must be able to convey both comedy and pathos, with a strong tenor voice.",
        gender: "Male",
        ageRange: "12-18",
        vocalRange: "Tenor (C3-G4)",
        notes: "Principal role. Requires strong vocal skills and excellent comedic timing. Must be comfortable with physical comedy."
      },
      {
        name: "Mal Beineke",
        description: "Lucas's father, a conservative businessman from Ohio. He is uptight, judgmental, but ultimately capable of change. Must be able to convey both comedy and character growth, with a strong baritone voice.",
        gender: "Male",
        ageRange: "40-60",
        vocalRange: "Baritone (F2-D4)",
        notes: "Principal role. Requires strong vocal skills and excellent comedic timing. Must be comfortable with both comedy and character growth."
      },
      {
        name: "Alice Beineke",
        description: "Lucas's mother, a former wild child who has become repressed. She is uptight, judgmental, but ultimately capable of change. Must be able to convey both comedy and character growth, with a strong soprano voice.",
        gender: "Female",
        ageRange: "35-55",
        vocalRange: "Soprano (C4-F6)",
        notes: "Principal role. Requires strong vocal skills and excellent comedic timing. Must be comfortable with both comedy and character growth."
      },
      {
        name: "Lurch",
        description: "The Addams' butler who is tall, slow-moving, and speaks in deep, drawn-out tones. He provides comic relief and is ultimately loyal to the family. Must be able to convey both comedy and loyalty, with a deep bass voice.",
        gender: "Male",
        ageRange: "25-45",
        vocalRange: "Bass (E2-C4)",
        notes: "Supporting role. Requires strong vocal skills and excellent comedic timing. Must be comfortable with physical comedy and slow movement."
      }
    ],
    auditionMaterials: [
      {
        type: "script",
        fileName: "Addams_Family_Sides.pdf",
        fileUrl: "https://castable-audition-files.s3.amazonaws.com/addams-family/sides.pdf",
        fileSize: 2560000,
        mimeType: "application/pdf"
      },
      {
        type: "music",
        fileName: "Addams_Family_Vocal_Selections.mp3",
        fileUrl: "https://castable-audition-files.s3.amazonaws.com/addams-family/vocal-selections.mp3",
        fileSize: 20971520,
        mimeType: "audio/mpeg"
      },
      {
        type: "script",
        fileName: "Character_Guide.pdf",
        fileUrl: "https://castable-audition-files.s3.amazonaws.com/addams-family/character-guide.pdf",
        fileSize: 1536000,
        mimeType: "application/pdf"
      },
      {
        type: "music",
        fileName: "Dance_Rehearsal_Track.mp3",
        fileUrl: "https://castable-audition-files.s3.amazonaws.com/addams-family/dance-track.mp3",
        fileSize: 8388608,
        mimeType: "audio/mpeg"
      }
    ]
  }
];

async function createMockShows() {
  try {
    console.log('Creating mock shows...\n');

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: USER_EMAIL }
    });

    if (!user) {
      console.error(`❌ User with email ${USER_EMAIL} not found`);
      return;
    }

    console.log(`✅ Found user: ${user.email} (ID: ${user.id})\n`);

    for (const showData of mockShows) {
      console.log(`Creating show: ${showData.title}`);
      
      // Create the show
      const show = await prisma.show.create({
        data: {
          title: showData.title,
          description: showData.description,
          director: showData.director,
          organization: showData.organization,
          auditionDate: showData.auditionDate,
          deadline: showData.deadline,
          location: showData.location,
          contactEmail: showData.contactEmail,
          contactPhone: showData.contactPhone,
          status: showData.status,
          userId: user.id,
          characters: {
            create: showData.characters.map(character => ({
              name: character.name,
              description: character.description,
              gender: character.gender,
              ageRange: character.ageRange,
              vocalRange: character.vocalRange,
              notes: character.notes
            }))
          },
          auditionMaterials: {
            create: showData.auditionMaterials.map(material => ({
              type: material.type,
              fileName: material.fileName,
              fileUrl: material.fileUrl,
              fileSize: material.fileSize,
              mimeType: material.mimeType
            }))
          }
        }
      });

      console.log(`✅ Created show: ${show.title} (ID: ${show.id})`);
      console.log(`   - ${showData.characters.length} characters`);
      console.log(`   - ${showData.auditionMaterials.length} audition materials`);
      console.log(`   - Audition date: ${showData.auditionDate.toLocaleDateString()}`);
      console.log(`   - Deadline: ${showData.deadline.toLocaleDateString()}`);
      console.log(`   - Show ID: ${show.id}\n`);
    }

    console.log('🎉 All mock shows created successfully!');
    console.log('\nNext steps:');
    console.log('1. Test the shows by visiting the dashboard');
    console.log('2. Check the public audition pages');
    console.log('3. Verify all characters and audition materials were created');

  } catch (error) {
    console.error('❌ Error creating mock shows:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createMockShows();
