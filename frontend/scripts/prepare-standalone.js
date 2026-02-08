const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const standaloneDir = path.join(projectRoot, '.next', 'standalone');
const staticSrc = path.join(projectRoot, '.next', 'static');
const staticDest = path.join(standaloneDir, '.next', 'static');
const publicSrc = path.join(projectRoot, 'public');
const publicDest = path.join(standaloneDir, 'public');

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`Source not found, skipping: ${src}`);
    return;
  }

  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function copyFileIfExists(filename) {
  const src = path.join(projectRoot, filename);
  const dest = path.join(standaloneDir, filename);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${filename}`);
  }
}

console.log('Preparing standalone build...\n');

// Verify standalone output exists
if (!fs.existsSync(standaloneDir)) {
  console.error('ERROR: .next/standalone/ not found.');
  console.error('Make sure next.config.ts has output: "standalone" and run "next build" first.');
  process.exit(1);
}

// Copy static files
console.log('Copying .next/static/ ...');
copyDirSync(staticSrc, staticDest);

// Copy public folder
console.log('Copying public/ ...');
copyDirSync(publicSrc, publicDest);

// Copy env files
copyFileIfExists('.env');
copyFileIfExists('.env.local');
copyFileIfExists('.env.production');
copyFileIfExists('.env.production.local');

console.log('\nStandalone build prepared successfully!');
