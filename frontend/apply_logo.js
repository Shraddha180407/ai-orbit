const fs = require('fs');
const path = require('path');

const sourcePath = "C:\\Users\\ak673\\.gemini\\antigravity-ide\\brain\\74f166b3-0cd3-4603-b3ee-bd864261a096\\.user_uploaded\\media_1787835510726.jpg";

// Copy to public folder (for the UI logo)
const publicLogoPath = path.join(__dirname, 'public', 'logo.jpg');

// Copy to app folder (for the favicon)
const appIconPath = path.join(__dirname, 'src', 'app', 'icon.jpg');
const oldPngIcon = path.join(__dirname, 'src', 'app', 'icon.png');

try {
  fs.copyFileSync(sourcePath, publicLogoPath);
  console.log("✅ Copied to public/logo.jpg");

  fs.copyFileSync(sourcePath, appIconPath);
  console.log("✅ Copied to src/app/icon.jpg");

  // Remove the old icon.png if it exists
  if (fs.existsSync(oldPngIcon)) {
    fs.unlinkSync(oldPngIcon);
    console.log("✅ Removed old icon.png");
  }

} catch (err) {
  console.error("❌ Error copying file:", err.message);
}
