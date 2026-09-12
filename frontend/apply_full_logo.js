const fs = require('fs');
const path = require('path');

const sourcePath = "C:\\Users\\ak673\\.gemini\\antigravity-ide\\brain\\74f166b3-0cd3-4603-b3ee-bd864261a096\\.user_uploaded\\media_1787836086757.png";

// Copy to public folder as the full width logo
const publicFullLogoPath = path.join(__dirname, 'public', 'logo-full.png');

try {
  fs.copyFileSync(sourcePath, publicFullLogoPath);
  console.log("✅ Copied wide logo to public/logo-full.png");
} catch (err) {
  console.error("❌ Error copying file:", err.message);
}
