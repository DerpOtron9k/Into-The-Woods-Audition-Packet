const fs = require('fs');
const path = require('path');

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