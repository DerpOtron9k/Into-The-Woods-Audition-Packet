const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create dist and public directories if they don't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

if (!fs.existsSync('dist/js')) {
  fs.mkdirSync('dist/js');
}

if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

if (!fs.existsSync('public/js')) {
  fs.mkdirSync('public/js', { recursive: true });
}

// Copy HTML file
fs.copyFileSync('src/index.html', 'dist/index.html');
fs.copyFileSync('src/index.html', 'public/index.html');

// Copy JS files
const jsFiles = fs.readdirSync('src/js');
jsFiles.forEach(file => {
  if (file.endsWith('.js')) {
    fs.copyFileSync(`src/js/${file}`, `dist/js/${file}`);
    fs.copyFileSync(`src/js/${file}`, `public/js/${file}`);
  }
});

console.log('Files copied successfully!');

// Compile Tailwind CSS
try {
  console.log('Compiling Tailwind CSS...');
  
  // Create a temporary CSS file that includes the Google Fonts import
  const mainCssContent = fs.readFileSync('src/css/main.css', 'utf8');
  
  // Compile Tailwind CSS
  execSync('npx tailwindcss -i ./src/css/main.css -o ./public/styles.css --minify', {
    stdio: 'inherit'
  });
  
  // Copy to dist
  fs.copyFileSync('public/styles.css', 'dist/styles.css');
  
  console.log('Tailwind CSS compiled successfully!');
} catch (error) {
  console.error('Error compiling Tailwind CSS:', error.message);
  
  // Create a fallback CSS file with Google Fonts import
  console.log('Creating fallback CSS file...');
  const fallbackCSS = `
/* Fallback CSS - Tailwind compilation failed */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');

body { font-family: 'Inter', sans-serif; }
h1, h2, h3 { font-family: 'Playfair Display', serif; }

:root {
  --color-primary: #2E4035;
  --color-secondary: #F0F5F2;
  --color-accent: #BFAE9C;
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
.btn { padding: 0.5rem 1rem; background: var(--color-primary); color: white; border: none; border-radius: 0.25rem; }
.form-group { margin-bottom: 1.5rem; }
.form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
.form-group label.required::after { content: '*'; color: #dc2626; margin-left: 0.25rem; }
.form-group input, .form-group select, .form-group textarea {
  width: 100%; padding: 0.75rem 1rem; border: 2px solid #d1d5db; border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  border-color: var(--color-primary); outline: none; box-shadow: 0 0 0 4px rgba(46, 64, 53, 0.1);
}
.error-message { margin-top: 0.25rem; display: none; font-size: 0.875rem; color: #dc2626; }
.error-message.show { display: block; }
.help-text { margin-top: 0.25rem; font-size: 0.875rem; color: #6b7280; }
.success-message { margin-top: 0.25rem; display: none; font-size: 0.875rem; color: #16a34a; }
.success-message.show { display: block; }

.character-card { cursor: pointer; border: 2px solid transparent; box-shadow: 0 1px 2px rgba(0,0,0,0.05); 
  transition: all 0.2s ease-in-out; padding: 1.25rem; background-color: #f9fafb; border-radius: 0.5rem; }
.character-card:hover { transform: translateY(-0.25rem); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1); border-color: #d1d5db; }
.character-card.selected { border-color: var(--color-primary); background-color: var(--color-secondary); 
  transform: translateY(-0.25rem); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1); }

.storybook-container { max-width: 48rem; margin: 2rem auto; padding: 2rem; background: white; 
  border: 1px solid #e5e7eb; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1); }
@media (min-width: 640px) { .storybook-container { padding: 3rem; } }

.decorative-line { height: 1px; margin: 2.5rem 0; 
  background: linear-gradient(to right, transparent, var(--color-accent), transparent); }

/* Basic utility classes */
.hidden { display: none; }
.text-center { text-align: center; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-8 { margin-bottom: 2rem; }
.p-4 { padding: 1rem; }
.p-5 { padding: 1.25rem; }
.rounded { border-radius: 0.25rem; }
.rounded-lg { border-radius: 0.5rem; }
.border { border: 1px solid #e5e7eb; }
.bg-gray-50 { background-color: #f9fafb; }
.bg-white { background-color: white; }
.text-gray-600 { color: #4b5563; }
.text-gray-700 { color: #374151; }
.text-gray-800 { color: #1f2937; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.gap-4 { gap: 1rem; }
.gap-6 { gap: 1.5rem; }
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.space-y-3 > * + * { margin-top: 0.75rem; }
.space-y-6 > * + * { margin-top: 1.5rem; }
.list-disc { list-style-type: disc; }
.list-inside { list-style-position: inside; }
.shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1); }
.transition-colors { transition-property: color, background-color, border-color; transition-duration: 150ms; }
.duration-300 { transition-duration: 300ms; }
.hover\\:bg-gray-200:hover { background-color: #e5e7eb; }
.hover\\:underline:hover { text-decoration: underline; }
@media (min-width: 768px) {
  .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .md\\:text-5xl { font-size: 3rem; line-height: 1; }
}
`;
  
  fs.writeFileSync('./public/styles.css', fallbackCSS);
  fs.writeFileSync('./dist/styles.css', fallbackCSS);
  console.log('Fallback CSS file created successfully!');
}

console.log('Build process completed successfully!');