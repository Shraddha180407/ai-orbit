const fs = require('fs');
const zlib = require('zlib');
const buf = fs.readFileSync('C:/Users/shrad/.gemini/antigravity/brain/610edbc0-1a62-47b6-8eb0-986ea922d09b/.user_uploaded/media_1790076371083.png');
let pos = 8;
const idatChunks = [];
while (pos < buf.length) {
  const len = buf.readUInt32BE(pos);
  const type = buf.toString('ascii', pos + 4, pos + 8);
  if (type === 'IDAT') idatChunks.push(buf.subarray(pos + 8, pos + 8 + len));
  pos += 12 + len;
}
const raw = zlib.inflateSync(Buffer.concat(idatChunks));
const width = 1024;
const height = 441;
const stride = 1 + width * 4;

function unfilterPNG(raw, width, height) {
  const bytesPerPixel = 4;
  const stride = 1 + width * bytesPerPixel;
  const out = Buffer.alloc(width * height * bytesPerPixel);
  
  for (let y = 0; y < height; y++) {
    const filterType = raw[y * stride];
    const rowStart = y * stride + 1;
    const outRowStart = y * width * bytesPerPixel;
    const prevOutRowStart = (y - 1) * width * bytesPerPixel;

    for (let x = 0; x < width * bytesPerPixel; x++) {
      const val = raw[rowStart + x];
      let left = x >= bytesPerPixel ? out[outRowStart + x - bytesPerPixel] : 0;
      let up = y > 0 ? out[prevOutRowStart + x] : 0;
      let upleft = (y > 0 && x >= bytesPerPixel) ? out[prevOutRowStart + x - bytesPerPixel] : 0;

      if (filterType === 0) out[outRowStart + x] = val;
      else if (filterType === 1) out[outRowStart + x] = (val + left) & 0xff;
      else if (filterType === 2) out[outRowStart + x] = (val + up) & 0xff;
      else if (filterType === 3) out[outRowStart + x] = (val + Math.floor((left + up) / 2)) & 0xff;
      else if (filterType === 4) {
        const p = left + up - upleft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upleft);
        let pr = (pa <= pb && pa <= pc) ? left : (pb <= pc ? up : upleft);
        out[outRowStart + x] = (val + pr) & 0xff;
      }
    }
  }
  return out;
}

const pixels = unfilterPNG(raw, width, height);

// Find white pill bounds around y=80..140
for (let y = 80; y < 140; y += 2) {
  let whiteRanges = [];
  let inWhite = false;
  let startX = 0;
  for (let x = 0; x < 350; x++) {
    const idx = (y * width + x) * 4;
    const r = pixels[idx], g = pixels[idx+1], b = pixels[idx+2];
    const isWhite = r > 245 && g > 245 && b > 245;
    if (isWhite && !inWhite) {
      inWhite = true;
      startX = x;
    } else if (!isWhite && inWhite) {
      inWhite = false;
      if (x - startX > 15) {
        whiteRanges.push(`[${startX}..${x}] (w=${x - startX})`);
      }
    }
  }
  if (whiteRanges.length > 0) {
    console.log(`y=${y}:`, whiteRanges.join(', '));
  }
}
