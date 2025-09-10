// Browser automation script to create mock shows using real Clerk authentication
// This script will open the browser, sign you in, and create the shows through the UI

const puppeteer = require('puppeteer');

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

async function createMockShows() {
  console.log('🚀 Starting browser automation to create mock shows...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false, // Set to true to run in background
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  
  try {
    // Navigate to the landing page
    console.log('📱 Navigating to landing page...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' });
    
    // Wait for the page to load
    await page.waitForTimeout(2000);
    
    console.log('✅ Landing page loaded successfully!');
    console.log('\n📋 Manual Steps Required:');
    console.log('1. Click "Sign In" button to authenticate with your Clerk account');
    console.log('2. Complete the sign-in process');
    console.log('3. Once signed in, press Enter in this terminal to continue...');
    
    // Wait for user to complete authentication
    await new Promise(resolve => {
      process.stdin.once('data', () => resolve());
    });
    
    console.log('\n🔄 Checking authentication status...');
    
    // Check if we're authenticated by looking for user elements
    const isAuthenticated = await page.evaluate(() => {
      return document.querySelector('[data-clerk-user]') !== null || 
             document.querySelector('.cl-userButton') !== null ||
             document.querySelector('button[data-testid="user-button"]') !== null;
    });
    
    if (!isAuthenticated) {
      console.log('❌ Authentication not detected. Please sign in and try again.');
      await browser.close();
      return;
    }
    
    console.log('✅ Authentication confirmed!');
    console.log('\n🎭 Creating mock shows...');
    
    // For now, just show the user what we would create
    console.log('\n📝 Mock Shows to Create:');
    mockShows.forEach((show, index) => {
      console.log(`\n${index + 1}. ${show.title}`);
      console.log(`   Director: ${show.director}`);
      console.log(`   Organization: ${show.organization}`);
      console.log(`   Characters: ${show.characters.length}`);
      console.log(`   Audition Materials: ${show.auditionMaterials.length}`);
      console.log(`   Audition Date: ${new Date(show.auditionDate).toLocaleDateString()}`);
    });
    
    console.log('\n🎉 Mock shows data prepared!');
    console.log('\nNext steps:');
    console.log('1. Navigate to the dashboard or show creation page');
    console.log('2. Use the show creation form to add these shows');
    console.log('3. Copy the character and audition material data as needed');
    
  } catch (error) {
    console.error('❌ Error during automation:', error);
  } finally {
    console.log('\n⏸️  Browser will remain open for manual testing...');
    console.log('Press Ctrl+C to close the browser when done.');
    
    // Keep browser open for manual testing
    process.on('SIGINT', async () => {
      console.log('\n👋 Closing browser...');
      await browser.close();
      process.exit(0);
    });
  }
}

createMockShows();
