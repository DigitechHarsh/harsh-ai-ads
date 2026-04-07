const fs = require('fs');
const path = require('path');

const src = "C:\\Users\\HP\\.gemini\\antigravity\\brain\\9026a283-155d-4bb7-8da1-b95d70b527e8\\media__1775554175629.png";
const dest = "c:\\Users\\HP\\OneDrive\\Desktop\\cinematic-ai-ads-main\\src\\assets\\whatsapp-logo.png";

try {
  fs.copyFileSync(src, dest);
  console.log('Successfully copied logo');
} catch (err) {
  console.error('Error copying logo:', err);
}
