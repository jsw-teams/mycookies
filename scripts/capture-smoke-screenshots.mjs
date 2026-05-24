import fs from "node:fs/promises";
import { createReadStream } from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const outputDir = path.join(rootDir, "docs", "screenshots");
const requireFromAccountSystem = createRequire("/opt/account-system/package.json");
const { chromium } = requireFromAccountSystem("playwright");

const previews = [
  { id: "demo", root: path.join(rootDir, "public"), port: 49201, url: "/demo.html" }
];

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
  [".xml", "application/xml; charset=utf-8"]
]);

function safeJoin(root, requestPath) {
  const decoded = decodeURIComponent(requestPath.split("?")[0]);
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  return path.join(root, normalized);
}

async function resolveFile(root, requestPath) {
  if (requestPath === "/cdn-cgi/trace") return null;
  let filePath = safeJoin(root, requestPath);
  const candidates = [];
  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) filePath = path.join(filePath, "index.html");
  } catch {
    if (!path.extname(filePath)) {
      candidates.push(`${filePath}.html`);
      candidates.push(path.join(filePath, "index.html"));
    }
  }
  candidates.push(filePath);
  for (const candidate of candidates) {
    try {
      const stat = await fs.stat(candidate);
      if (stat.isFile()) return candidate;
    } catch {
      /* Try the next static fallback. */
    }
  }
  try {
    const stat = await fs.stat(filePath);
    if (stat.isFile()) return filePath;
  } catch {
    return null;
  }
  return null;
}

function serveStatic(root, port) {
  const server = http.createServer(async (req, res) => {
    try {
      if (req.url?.startsWith("/cdn-cgi/trace")) {
        res.writeHead(200, { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" });
        res.end("loc=US\n");
        return;
      }
      const filePath = await resolveFile(root, req.url || "/");
      if (!filePath) {
        res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
        res.end("Not found");
        return;
      }
      res.writeHead(200, {
        "content-type": contentTypes.get(path.extname(filePath)) || "application/octet-stream",
        "cache-control": "no-store"
      });
      createReadStream(filePath).pipe(res);
    } catch (error) {
      res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
      res.end(String(error?.stack || error));
    }
  });
  return new Promise((resolve) => {
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

async function waitForBanner(page) {
  await page.waitForSelector(".privacy-plugin-banner", { timeout: 8000 });
}

async function captureApp(page, preview) {
  const baseUrl = `http://127.0.0.1:${preview.port}`;
  console.log(`Capturing ${preview.id} banner...`);
  await page.goto(`${baseUrl}${preview.url}`, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    localStorage.removeItem("privacy_plugins_consent_v4");
    localStorage.removeItem("privacy_plugins_consent_v3");
    localStorage.removeItem("privacy_plugins_region_v1");
  });
  await page.reload({ waitUntil: "networkidle" });
  try {
    await waitForBanner(page);
  } catch (error) {
    await page.screenshot({
      path: path.join(outputDir, `${preview.id}-diagnostic.png`),
      fullPage: true
    });
    const bodyText = await page.locator("body").innerText().catch(() => "");
    throw new Error(`${preview.id} banner did not appear. Body text: ${bodyText.slice(0, 400)}`, { cause: error });
  }
  await page.screenshot({
    path: path.join(outputDir, `${preview.id}-banner.png`),
    fullPage: true
  });
}

async function capturePreferenceCenter(page, preview) {
  const baseUrl = `http://127.0.0.1:${preview.port}`;
  console.log(`Capturing ${preview.id} preference center...`);
  await page.goto(`${baseUrl}${preview.url}`, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    localStorage.removeItem("privacy_plugins_consent_v4");
    localStorage.removeItem("privacy_plugins_consent_v3");
    localStorage.removeItem("privacy_plugins_region_v1");
  });
  await page.reload({ waitUntil: "networkidle" });
  await waitForBanner(page);
  await page.locator("[data-privacy-action='customize']").click();
  await page.waitForSelector(".privacy-plugin-overlay", { timeout: 4000 });
  await page.screenshot({
    path: path.join(outputDir, `${preview.id}-preferences.png`),
    fullPage: true
  });
}

async function captureGlobalOptOutPreferenceCenter(page, preview) {
  const baseUrl = `http://127.0.0.1:${preview.port}`;
  console.log(`Capturing ${preview.id} Global Privacy Control preference center...`);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "globalPrivacyControl", {
      configurable: true,
      get: () => true
    });
  });
  await page.goto(`${baseUrl}${preview.url}`, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    localStorage.removeItem("privacy_plugins_consent_v4");
    localStorage.removeItem("privacy_plugins_consent_v3");
    localStorage.removeItem("privacy_plugins_region_v1");
  });
  await page.reload({ waitUntil: "networkidle" });
  await waitForBanner(page);
  await page.locator("[data-privacy-action='customize']").click();
  await page.waitForSelector(".privacy-plugin-overlay", { timeout: 4000 });
  await page.screenshot({
    path: path.join(outputDir, `${preview.id}-gpc-preferences.png`),
    fullPage: true
  });
}

async function captureBuilder(page, preview) {
  const baseUrl = `http://127.0.0.1:${preview.port}`;
  console.log("Capturing builder...");
  await page.setViewportSize({ width: 980, height: 1100 });
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.waitForSelector("#component-list .component-card", { timeout: 8000 });
  await page.locator("[data-lang='zh-CN']").click();
  await page.screenshot({
    path: path.join(outputDir, "builder.png"),
    fullPage: true
  });
}

await fs.rm(outputDir, { recursive: true, force: true });
await fs.mkdir(outputDir, { recursive: true });
const servers = [];

try {
  for (const preview of previews) {
    servers.push(await serveStatic(preview.root, preview.port));
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 }, deviceScaleFactor: 1 });

  const demo = previews.find((preview) => preview.id === "demo");
  await captureApp(page, demo);
  await capturePreferenceCenter(page, demo);
  const gpcPage = await browser.newPage({ viewport: { width: 1366, height: 900 }, deviceScaleFactor: 1 });
  await captureGlobalOptOutPreferenceCenter(gpcPage, demo);
  await gpcPage.close();
  await captureBuilder(page, demo);
  await browser.close();
} finally {
  await Promise.all(servers.map((server) => new Promise((resolve) => server.close(resolve))));
}

console.log(`Wrote smoke screenshots to ${outputDir}`);
