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

// Compile Tailwind CSS using npx instead of direct binary
try {
  console.log('Compiling Tailwind CSS...');
  execSync('npx tailwindcss -i ./src/css/main.css -o ./dist/styles.css --minify', { stdio: 'inherit' });
  console.log('Tailwind CSS compiled successfully!');
} catch (error) {
  console.error('Error compiling Tailwind CSS:', error.message);
  process.exit(1);
}