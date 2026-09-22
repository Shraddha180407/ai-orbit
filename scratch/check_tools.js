const fs = require('fs');
const content = fs.readFileSync('src/data/toolsData.js', 'utf8');
const lines = content.split('\n');
const seen = new Map();
lines.forEach((line, idx) => {
  const m = line.match(/"id":\s*"([^"]+)"/);
  if (m) {
    const id = m[1];
    if (seen.has(id)) {
      console.log('Duplicate id:', id, 'first at line', seen.get(id), 'again at line', idx + 1);
    } else {
      seen.set(id, idx + 1);
    }
  }
});
console.log('Total unique IDs:', seen.size);
