// Portfolio media capture (screenshots at 1440px and 390px, plus optional walkthrough video).
// Usage: npm run media -- [baseURL] [outDir] [label] [--video]
//   defaults: http://localhost:4173  ./portfolio-media  after
// Start the app first (npm run build && npm run preview). Requires: npx playwright install chromium
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const flags = args.filter(a => a.startsWith("--"));
const [baseURL = "http://localhost:4173", outDir = "portfolio-media", label = "after"] = args.filter(a => !a.startsWith("--"));
const withVideo = flags.includes("--video");
fs.mkdirSync(outDir, { recursive: true });

const viewports = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};

const log = [];
const note = (m) => { log.push(m); console.log(m); };

async function settle(page, ms = 1500) {
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(ms);
}

// Scroll through the page so scroll-reveal / lazy content is rendered before a full-page shot.
async function revealAll(page) {
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    let y = 0;
    for (let i = 0; i < 200; i++) {
      window.scrollTo(0, y);
      await sleep(160);
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) break;
      y += Math.round(window.innerHeight * 0.5);
    }
    await sleep(900);
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
}

async function clientNav(page, to) {
  await page.evaluate((p) => {
    window.history.pushState({}, "", p);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, to);
  await settle(page, 1000);
}

async function shot(page, name, vp) {
  await revealAll(page);
  const file = path.join(outDir, `${label}-${vp}-${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  note(`saved ${file}`);
}

async function addFirstToCart(page) {
  const btn = page.getByRole("button", { name: /add to (bag|cart)/i }).first();
  if (await btn.count()) { await btn.click(); await page.waitForTimeout(800); return true; }
  note("add-to-cart button not found");
  return false;
}

async function closeOverlays(page) {
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(300);
}

const browser = await chromium.launch();
for (const [vp, size] of Object.entries(viewports)) {
  const ctx = await browser.newContext({ viewport: size, deviceScaleFactor: vp === "mobile" ? 2 : 1 });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => note(`[${vp}] pageerror: ${e.message.slice(0, 200)}`));
  page.on("console", (m) => { if (m.type() === "error") note(`[${vp}] console.error: ${m.text().slice(0, 200)}`); });

  await page.goto(baseURL + "/"); await settle(page, 2500); await shot(page, "01-home", vp);
  await page.goto(baseURL + "/products"); await settle(page); await shot(page, "02-product-listing", vp);
  await page.goto(baseURL + "/details/1"); await settle(page); await shot(page, "03-product-detail", vp);
  await addFirstToCart(page);
  await closeOverlays(page);
  await clientNav(page, "/cart"); await shot(page, "04-cart", vp);
  await clientNav(page, "/checkout"); await shot(page, "05-checkout", vp);
  await page.goto(baseURL + "/login"); await settle(page); await shot(page, "06-login", vp);
  await page.goto(baseURL + "/products?purpose=Apparel"); await settle(page); await shot(page, "07-apparel-listing", vp);
  await page.goto(baseURL + "/details/21"); await settle(page); await shot(page, "08-apparel-detail", vp);
  const menuBtn = page.locator('button[aria-controls="mobile-menu"]');
  if (vp === "mobile" && await menuBtn.isVisible()) {
    await page.goto(baseURL + "/"); await settle(page, 1500);
    await menuBtn.click(); await page.waitForTimeout(600);
    const file = path.join(outDir, `${label}-${vp}-09-menu.png`);
    await page.screenshot({ path: file });
    note(`saved ${file}`);
    await closeOverlays(page);
  }
  await page.goto(baseURL + "/manage-users"); await settle(page);
  note(`[${vp}] /manage-users without auth resolved to ${new URL(page.url()).pathname}`);
  await ctx.close();
}

if (withVideo) {
  for (const [vp, size] of Object.entries(viewports)) {
    const vdir = path.join(outDir, "_video_tmp_" + vp);
    const ctx = await browser.newContext({ viewport: size, recordVideo: { dir: vdir, size } });
    const page = await ctx.newPage();
    const smooth = async (px, steps = 12) => { for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, px / steps); await page.waitForTimeout(90); } };
    await page.goto(baseURL + "/"); await settle(page, 2500);
    const vMenu = page.locator('button[aria-controls="mobile-menu"]');
    if (await vMenu.isVisible()) { await vMenu.click(); await page.waitForTimeout(1500); await vMenu.click(); await page.waitForTimeout(500); }
    for (let i = 0; i < 6; i++) await smooth(700);
    await page.waitForTimeout(800);
    await page.goto(baseURL + "/products?purpose=Apparel"); await settle(page, 1200);
    await smooth(900); await page.waitForTimeout(800);
    await page.goto(baseURL + "/products"); await settle(page, 1200);
    await smooth(900); await page.waitForTimeout(600);
    const next = page.locator('li[aria-label="next page button"]');
    if (await next.count()) { await smooth(2500); await next.click(); await page.waitForTimeout(1500); }
    const card = page.locator('a[href^="/details/"]').first();
    if (await card.count()) { await card.click(); await settle(page, 1200); } else { await page.goto(baseURL + "/details/1"); await settle(page); }
    await smooth(500); await page.waitForTimeout(500);
    await addFirstToCart(page); await page.waitForTimeout(1500);
    await closeOverlays(page);
    await clientNav(page, "/cart"); await page.waitForTimeout(1200);
    await clientNav(page, "/checkout"); await smooth(600); await page.waitForTimeout(1000);
    await page.goto(baseURL + "/login"); await settle(page, 1500);
    const video = page.video();
    await ctx.close();
    const src = await video.path();
    const dest = path.join(outDir, `${label}-${vp}-walkthrough.webm`);
    fs.copyFileSync(src, dest);
    fs.rmSync(vdir, { recursive: true, force: true });
    note(`saved ${dest}`);
  }
}

await browser.close();
fs.writeFileSync(path.join(outDir, `${label}-capture-log.txt`), log.join("\n") + "\n");
