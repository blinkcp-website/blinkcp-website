/**
 * Headless carousel renderer.
 *
 * Reads a slides JSON file and writes one 1080x1350 PNG per slide, using the
 * same index.html markup and CSS the browser tool uses -- so what CI produces
 * is what you see when you open the tool by hand.
 *
 *   node tools/carousel/render.mjs <slides.json> <output-dir>
 *
 * Input shape:
 *   {
 *     "posts": [
 *       { "name": "2026-10-12-post1-dscr-dial",
 *         "slides": [ { "type": "hook", "headline": "...", ... } ] }
 *     ]
 *   }
 *
 * Slide types: hook | num | stat | cta  (see index.html for the fields each uses)
 */

import { readFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer";

const HERE = dirname(fileURLToPath(import.meta.url));
const TEMPLATE = join(HERE, "index.html");

const [, , slidesPath, outDirArg] = process.argv;
if (!slidesPath) {
  console.error("usage: node tools/carousel/render.mjs <slides.json> [output-dir]");
  process.exit(1);
}

const outDir = resolve(outDirArg || join(HERE, "out"));
const data = JSON.parse(readFileSync(resolve(slidesPath), "utf8"));
const posts = Array.isArray(data.posts) ? data.posts : [data];

if (!posts.length) {
  console.error("No posts found in " + slidesPath);
  process.exit(1);
}
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

let written = 0;
try {
  for (const post of posts) {
    const name = post.name || "post";
    const slides = post.slides || [];
    if (!slides.length) {
      console.warn(`  ${name}: no slides, skipping`);
      continue;
    }

    const page = await browser.newPage();
    // deviceScaleFactor 1 -- the slide element is already 1080x1350 CSS px,
    // so the screenshot is natively full resolution.
    await page.setViewport({ width: 1200, height: 1500, deviceScaleFactor: 1 });

    await page.evaluateOnNewDocument((payload) => {
      window.__SLIDE_DATA__ = payload;
    }, { postName: name, slides });

    await page.goto(pathToFileURL(TEMPLATE).href, { waitUntil: "networkidle0" });
    // Google Fonts load over the network; without this the first slides can
    // render in the fallback face.
    await page.evaluateHandle("document.fonts.ready");

    for (let i = 0; i < slides.length; i++) {
      // Un-scale the preview so the capture is true 1080x1350.
      await page.evaluate((idx) => {
        const el = document.getElementById("slide-" + idx);
        el.style.transform = "none";
        const box = el.closest(".shrink");
        if (box) { box.style.width = "1080px"; box.style.height = "1350px"; }
      }, i);

      const el = await page.$("#slide-" + i);
      const file = join(outDir, `${name}-slide${String(i + 1).padStart(2, "0")}.png`);
      await el.screenshot({ path: file });
      written++;
    }

    console.log(`  ${name}: ${slides.length} slides`);
    await page.close();
  }
} finally {
  await browser.close();
}

console.log(`Wrote ${written} slide image(s) to ${outDir}`);
if (written === 0) process.exit(1);
