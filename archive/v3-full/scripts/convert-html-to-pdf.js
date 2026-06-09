// Convert HTML Blueprint to PDF using Playwright
// Usage: node convert-html-to-pdf.js <input.html> [output.pdf]
// Prereq: npm install playwright && npx playwright install chromium

const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const inputPath = process.argv[2] || './Master Blueprint.html';
  const outputPath = process.argv[3] || inputPath.replace(/\.html?$/, '.pdf');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const fileUrl = `file://${path.resolve(inputPath)}`;
  await page.goto(fileUrl, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000); // wait for Mermaid diagrams to render
  
  await page.pdf({
    path: path.resolve(outputPath),
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' }
  });
  
  console.log(`✅ PDF created: ${outputPath} (${require('fs').statSync(outputPath).size} bytes)`);
  await browser.close();
})();
