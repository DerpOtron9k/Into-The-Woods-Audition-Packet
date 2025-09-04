const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Create dist/js directory if it doesn't exist
if (!fs.existsSync('dist/js')) {
  fs.mkdirSync('dist/js');
}

// Create public directory (for Vercel deployment)
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

// Copy HTML file
fs.copyFileSync('src/index.html', 'dist/index.html');

// Copy JS files
const jsFiles = fs.readdirSync('src/js');
jsFiles.forEach(file => {
  if (file.endsWith('.js')) {
    fs.copyFileSync(`src/js/${file}`, `dist/js/${file}`);
  }
});

console.log('Files copied successfully!');

// Compile Tailwind CSS using execSync
try {
  console.log('Compiling Tailwind CSS...');
  
  // Use node_modules/.bin directly instead of npx
  const tailwindBin = path.join(process.cwd(), 'node_modules', '.bin', 'tailwindcss');
  execSync(`${tailwindBin} -i ./src/css/main.css -o ./dist/styles.css --minify`, {
    stdio: 'inherit'
  });
  
  console.log('Tailwind CSS compiled successfully!');
} catch (error) {
  console.error('Error compiling Tailwind CSS:', error.message);
  
  // Fallback: create a basic CSS file
  console.log('Creating fallback CSS file...');
  const fallbackCSS = `
/* Fallback CSS - Tailwind compilation failed */
body { font-family: system-ui, sans-serif; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
.btn { padding: 0.5rem 1rem; background: #333; color: white; border: none; border-radius: 0.25rem; }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; margin-bottom: 0.25rem; font-weight: 500; }
.form-group input, .form-group select, .form-group textarea {
  width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 0.25rem;
}
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
.transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.duration-300 { transition-duration: 300ms; }
.hover\\:bg-gray-200:hover { background-color: #e5e7eb; }
.hover\\:underline:hover { text-decoration: underline; }
@media (min-width: 768px) {
  .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .md\\:text-5xl { font-size: 3rem; line-height: 1; }
}
`;
  
  fs.writeFileSync('./dist/styles.css', fallbackCSS);
  console.log('Fallback CSS file created successfully!');
}

// Copy all files from dist to public (for Vercel deployment)
console.log('Copying files to public directory for Vercel...');
if (!fs.existsSync('public/js')) {
  fs.mkdirSync('public/js', { recursive: true });
}

// Copy HTML file to public
fs.copyFileSync('dist/index.html', 'public/index.html');

// Copy CSS file to public
fs.copyFileSync('dist/styles.css', 'public/styles.css');

// Copy JS files to public
jsFiles.forEach(file => {
  if (file.endsWith('.js')) {
    fs.copyFileSync(`src/js/${file}`, `public/js/${file}`);
  }
});

console.log('Files copied to public directory successfully!');