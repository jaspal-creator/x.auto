const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔍 Debug Production Build');
console.log('========================');

// Check if dist folder exists
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ dist folder not found. Please run "npm run build" first.');
  process.exit(1);
}

// Check if executable exists
const executablePath = path.join(distPath, 'win-unpacked', 'x.auto.exe');
if (!fs.existsSync(executablePath)) {
  console.error('❌ Executable not found. Please run "npm run build:unpack" first.');
  process.exit(1);
}

console.log('✅ Production build found');
console.log('🚀 Starting production build with debug output...');

// Run the production build with debug output
const child = spawn(executablePath, [], {
  stdio: 'inherit',
  env: {
    ...process.env,
    ELECTRON_ENABLE_LOGGING: '1',
    ELECTRON_ENABLE_STACK_DUMPING: '1'
  }
});

child.on('error', (err) => {
  console.error('❌ Failed to start production build:', err);
});

child.on('exit', (code, signal) => {
  if (code !== 0) {
    console.error(`❌ Production build exited with code ${code}, signal: ${signal}`);
  } else {
    console.log('✅ Production build exited normally');
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Terminating production build...');
  child.kill('SIGINT');
});
