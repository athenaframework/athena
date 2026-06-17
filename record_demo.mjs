/**
 * record_demo.mjs
 * Records a full demo video of the ATHENA 3D dashboard using Node.js Playwright.
 * Run: node record_demo.mjs
 */

import { chromium } from 'playwright';
import { mkdirSync, readdirSync, renameSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, 'demo_output');
mkdirSync(OUTPUT_DIR, { recursive: true });

const GOAL = process.argv[2] || 'Build a Python hello world function with unit tests';

const log = (msg) => console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);

async function run() {
  log('🎬 ATHENA Demo Recorder starting...');
  log(`📋 Goal: "${GOAL}"`);
  log('');

  log('🌐 Launching Chromium (headed)...');
  const browser = await chromium.launch({
    headless: false,
    args: ['--enable-webgl', '--use-gl=desktop'],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: OUTPUT_DIR,
      size: { width: 1440, height: 900 },
    },
  });

  const page = await context.newPage();

  // 1. Load dashboard
  log('📡 Connecting to ATHENA dashboard at http://localhost:3000...');
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('domcontentloaded');
  log('⏳ Waiting for 3D constellation to render...');
  await page.waitForTimeout(4000);

  await page.screenshot({ path: join(OUTPUT_DIR, '01_idle.png') });
  log('📸 Screenshot 1/4: idle state saved → demo_output/01_idle.png');

  // 2. Type goal in chat
  log('');
  log(`✍️  Typing goal into ATHENA chat...`);
  const chatInput = page.locator("input[placeholder*='directive'], input[placeholder*='goal'], input[placeholder*='Goal'], textarea").first();
  await chatInput.click();
  await chatInput.fill(GOAL);
  await page.waitForTimeout(500);

  // 3. Submit
  log('🚀 Submitting — dispatching swarm...');
  const sendBtn = page.locator("button[type='submit'], button:has-text('Send'), button:has-text('Run')").first();
  await sendBtn.click();
  log('⚡ Swarm activated — Oracle → Nexus → Forge → Cipher → Aegis');

  // 4. Capture mid-swarm
  log('⏳ Watching agents animate (6s)...');
  await page.waitForTimeout(6000);
  await page.screenshot({ path: join(OUTPUT_DIR, '02_swarm_running.png') });
  log('📸 Screenshot 2/4: swarm running → demo_output/02_swarm_running.png');

  // 5. Wait for completion
  log('⏳ Waiting for task completion (12s)...');
  await page.waitForTimeout(12000);
  await page.screenshot({ path: join(OUTPUT_DIR, '03_completed.png') });
  log('📸 Screenshot 3/4: completed → demo_output/03_completed.png');

  // 6. Scroll to artifacts
  log('📜 Scrolling to artifacts + logs...');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);
  await page.screenshot({ path: join(OUTPUT_DIR, '04_results.png') });
  log('📸 Screenshot 4/4: results → demo_output/04_results.png');

  // 7. Close
  log('');
  log('💾 Saving video...');
  await context.close();
  await browser.close();

  // Rename video
  const videos = readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.webm'));
  if (videos.length > 0) {
    const dest = join(__dirname, 'demo.webm');
    renameSync(join(OUTPUT_DIR, videos[0]), dest);
    const size = (statSync(dest).size / 1024 / 1024).toFixed(2);
    log('');
    log(`✅ Done!`);
    log(`   📹 Video  : ${dest} (${size} MB)`);
    log(`   🖼️  Screenshots: ${OUTPUT_DIR}`);
  } else {
    log('⚠️  No video file found in output dir');
  }
}

run().catch(err => {
  console.error('❌ Recording failed:', err.message);
  process.exit(1);
});
