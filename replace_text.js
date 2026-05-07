const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /Cinematic AI Ads/gi, replacement: "AI Ads" },
  { regex: /Cinematic AI Ad/gi, replacement: "AI Ad" },
  { regex: /Cinematic Ads/gi, replacement: "AI Ads" },
  { regex: /Cinematic Ad/gi, replacement: "AI Ad" },
  { regex: /cinematic ads/gi, replacement: "AI ads" },
  { regex: /cinematic ad/gi, replacement: "AI ad" },
  { regex: /Cinematic AI Prompts/gi, replacement: "AI Prompts" },
  { regex: /cinematic prompt/gi, replacement: "AI prompt" },
  { regex: /Cinematic Product Ads/gi, replacement: "AI Product Ads" },
  { regex: /cinematic video ads/gi, replacement: "AI video ads" },
  { regex: /cinematic agency/gi, replacement: "AI agency" },
  { regex: /cinematic storytelling/gi, replacement: "creative storytelling" },
  { regex: /cinematic editing/gi, replacement: "advanced editing" },
  { regex: /cinematic scenes/gi, replacement: "scenes" },
  { regex: /cinematic AI production/gi, replacement: "AI production process" },
];

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (
      fullPath.endsWith('.ts') || 
      fullPath.endsWith('.tsx') || 
      fullPath.endsWith('.html') || 
      fullPath.endsWith('.css')
    ) {
      replaceInFile(fullPath);
    }
  }
}

walkDir(path.join(__dirname, 'src'));
walkDir(path.join(__dirname, 'api'));
replaceInFile(path.join(__dirname, 'index.html'));
