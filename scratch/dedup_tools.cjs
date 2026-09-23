const fs = require('fs');
const content = fs.readFileSync('src/data/toolsData.js', 'utf8');

// Find where the array starts and ends
const startIdx = content.indexOf('export const AI_TOOLS_DATA = [');
const endIdx = content.lastIndexOf('];');

const prefix = content.slice(0, startIdx + 'export const AI_TOOLS_DATA = '.length);
const suffix = content.slice(endIdx + 2);
const arrayContent = content.slice(startIdx + 'export const AI_TOOLS_DATA = '.length, endIdx + 2);

// Parse the array (simple approach: track braces to find each object)
let objects = [];
let depth = 0;
let start = -1;

for (let i = 0; i < arrayContent.length; i++) {
  const ch = arrayContent[i];
  if (ch === '{') {
    if (depth === 0) start = i;
    depth++;
  } else if (ch === '}') {
    depth--;
    if (depth === 0 && start !== -1) {
      objects.push(arrayContent.slice(start, i + 1));
      start = -1;
    }
  }
}

console.log('Total objects parsed:', objects.length);

// Deduplicate by id (keep FIRST occurrence which has more detail)
const seenIds = new Set();
const uniqueObjects = [];

for (const obj of objects) {
  const idMatch = obj.match(/"id":\s*"([^"]+)"/);
  if (idMatch) {
    const id = idMatch[1];
    if (!seenIds.has(id)) {
      seenIds.add(id);
      uniqueObjects.push(obj);
    } else {
      console.log('Removing duplicate:', id);
    }
  } else {
    uniqueObjects.push(obj);
  }
}

console.log('Unique objects:', uniqueObjects.length);

// Rebuild the file
const newArray = '[' + uniqueObjects.join(',\n') + '\n]';
const newContent = prefix + newArray + suffix;

// Verify it looks right
console.log('New file size:', newContent.length, '(was:', content.length, ')');

fs.writeFileSync('src/data/toolsData.js', newContent, 'utf8');
console.log('Done! toolsData.js updated.');
