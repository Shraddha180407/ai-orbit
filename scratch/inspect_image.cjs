const fs = require('fs');

// We can read PNG dimensions
const buf = fs.readFileSync('C:/Users/shrad/.gemini/antigravity/brain/610edbc0-1a62-47b6-8eb0-986ea922d09b/.user_uploaded/media_1790076371083.png');
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);
console.log('Image dimensions:', width, 'x', height);
