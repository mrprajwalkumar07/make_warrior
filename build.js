const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, 'dist');

console.log('⚔️  Building Make Warrior distribution (dist/)...');

// Ensure dist directory exists and is clean
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy all files from public to dist
function copyDir(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`  ✓ Copied: ${entry.name} -> dist/${entry.name}`);
    }
  }
}

copyDir(srcDir, distDir);

console.log('✅ Distribution build complete! Production assets located in ./dist/\n');
