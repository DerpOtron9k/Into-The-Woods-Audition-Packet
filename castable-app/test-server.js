const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Copy test middleware to replace the main one
const testMiddlewarePath = path.join(__dirname, 'src', 'middleware.test.ts');
const mainMiddlewarePath = path.join(__dirname, 'src', 'middleware.ts');

console.log('Setting up test environment...');

// Backup original middleware
if (fs.existsSync(mainMiddlewarePath)) {
  fs.copyFileSync(mainMiddlewarePath, path.join(__dirname, 'src', 'middleware.backup.ts'));
}

// Copy test middleware
fs.copyFileSync(testMiddlewarePath, mainMiddlewarePath);

console.log('Starting test server...');

// Start the dev server
const server = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'test',
    MOCK_AUTH: 'true'
  }
});

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\nCleaning up...');
  
  // Restore original middleware
  if (fs.existsSync(path.join(__dirname, 'src', 'middleware.backup.ts'))) {
    fs.copyFileSync(path.join(__dirname, 'src', 'middleware.backup.ts'), mainMiddlewarePath);
    fs.unlinkSync(path.join(__dirname, 'src', 'middleware.backup.ts'));
  }
  
  server.kill();
  process.exit(0);
});

server.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
  
  // Restore original middleware
  if (fs.existsSync(path.join(__dirname, 'src', 'middleware.backup.ts'))) {
    fs.copyFileSync(path.join(__dirname, 'src', 'middleware.backup.ts'), mainMiddlewarePath);
    fs.unlinkSync(path.join(__dirname, 'src', 'middleware.backup.ts'));
  }
});

