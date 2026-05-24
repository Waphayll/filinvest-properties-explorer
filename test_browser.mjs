import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 5000 });
  } catch (e) {
    console.log('Navigation error (ignoring):', e.message);
  }
  
  await browser.close();
})();
