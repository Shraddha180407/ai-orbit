/* eslint-disable */
const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.jsx')) return;
  if (filePath.includes('Header.tsx') || filePath.includes('Footer.tsx') || filePath.includes('layout.tsx')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Remove imports
  content = content.replace(/import\s+\{\s*Header\s*\}\s+from\s+[\"'].*Header[\"'];?\n?/g, '');
  content = content.replace(/import\s+\{\s*Footer\s*\}\s+from\s+[\"'].*Footer[\"'];?\n?/g, '');

  // Remove component tags
  content = content.replace(/[ \t]*<Header\s*\/>\s*\n?/g, '');
  content = content.replace(/[ \t]*<Footer\s*\/>\s*\n?/g, '');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', filePath);
  }
}

walkDir('d:/AiOrbit/frontend/src/app', processFile);
walkDir('d:/AiOrbit/frontend/src/components', processFile);
console.log('Done');
