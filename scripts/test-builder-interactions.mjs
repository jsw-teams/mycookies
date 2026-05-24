import assert from "node:assert/strict";
import { createReadStream } from "node:fs";
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const publicDir = path.join(rootDir, "public");
const requireFromAccountSystem = createRequire("/opt/account-system/package.json");
const { chromium } = requireFromAccountSystem("playwright");
const port = 49202;

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".xml", "application/xml; charset=utf-8"]
]);

function safeJoin(root, requestPath) {
  const decoded = decodeURIComponent(requestPath.split("?")[0]);
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  return path.join(root, normalized === "/" ? "index.html" : normalized);
}

async function resolveFile(requestPath) {
  let filePath = safeJoin(publicDir, requestPath);
  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) filePath = path.join(filePath, "index.html");
    return filePath;
  } catch {
    return null;
  }
}

function serveStatic() {
  const server = http.createServer(async (req, res) => {
    const filePath = await resolveFile(req.url || "/");
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
  });
  return new Promise((resolve) => {
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

async function expectText(locator, expected) {
  const text = await locator.textContent();
  assert.ok(text?.includes(expected), `Expected "${text}" to include "${expected}"`);
}

const server = await serveStatic();
let browser;

try {
  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 980, height: 1100 }, deviceScaleFactor: 1 });
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
  await page.waitForSelector("#component-list .component-card", { timeout: 8000 });
  await page.locator("[data-lang='zh-CN']").click();

  assert.equal(await page.locator("text=mycookies").count(), 0, "Project name should not be visible in builder UI");
  await expectText(page.locator("h1"), "隐私 Banner 构建器");
  await expectText(page.locator("#validation-status"), "有效");
  await expectText(page.locator("#validation-source"), "构建器表单");

  await page.locator("#open-export").click();
  await page.waitForSelector("#export-dialog[open]", { timeout: 4000 });
  const jsonText = await page.locator("#config-json").inputValue();
  const config = JSON.parse(jsonText);
  assert.equal(config.requiredServices.length, 2);
  assert.equal(config.plugins.length, 1);
  assert.ok(!/token|data-cf-beacon/i.test(jsonText), "Exported config should not contain token fields");
  await page.locator("#export-dialog button[value='cancel']").click();
  await page.waitForFunction(() => !document.querySelector("#export-dialog")?.open, { timeout: 4000 });

  await page.locator("[data-select='cloudflare-web-analytics']").click();
  await page.locator("input[name='componentToken']").fill("TEST_TOKEN");
  await page.locator("input[name='componentName']").fill("Cloudflare Analytics Edited");
  await page.locator("#save-component").click();
  await expectText(page.locator("[data-select='cloudflare-web-analytics']"), "Cloudflare Analytics Edited");
  await page.locator("#open-export").click();
  await page.waitForSelector("#export-dialog[open]", { timeout: 4000 });
  const tokenConfigText = await page.locator("#config-json").inputValue();
  assert.match(tokenConfigText, /data-cf-beacon/);
  assert.match(tokenConfigText, /TEST_TOKEN/);

  const downloadPromise = page.waitForEvent("download");
  await page.locator("#download-json").click();
  const download = await downloadPromise;
  assert.equal(download.suggestedFilename(), "privacy-plugins.json");

  await page.locator("#config-json").fill("{");
  await page.locator("#config-json").dispatchEvent("input");
  await expectText(page.locator("#validation-status"), "需修正");
  await expectText(page.locator("#validation-list"), "JSON 无法解析");

  const importedConfig = {
    ...config,
    ui: {
      ...config.ui,
      "zh-CN": {
        ...config.ui["zh-CN"],
        bannerTitle: "测试隐私选择"
      }
    },
    plugins: []
  };
  await page.locator("#import-json").click();
  await page.waitForSelector("#import-dialog[open]", { timeout: 4000 });
  await page.locator("#import-source").fill(JSON.stringify(importedConfig, null, 2));
  await page.locator("#import-dialog button[value='apply']").click();
  await page.waitForFunction(() => !document.querySelector("#import-dialog")?.open, { timeout: 4000 });
  await expectText(page.locator("#preview-title"), "测试隐私选择");
  await expectText(page.locator("#validation-status"), "有效");
  await page.locator("#export-dialog button[value='cancel']").click();
  await page.waitForFunction(() => !document.querySelector("#export-dialog")?.open, { timeout: 4000 });

  const beforeCount = await page.locator("#component-list .component-card").count();
  await page.locator("#add-optional").click();
  assert.equal(await page.locator("#component-list .component-card").count(), beforeCount + 1);
  await page.locator("input[name='componentSrc']").fill("");
  await expectText(page.locator("#validation-status"), "需修正");
  await expectText(page.locator("#validation-list"), "脚本地址");
  await page.locator("#delete-component").click();
  assert.equal(await page.locator("#component-list .component-card").count(), beforeCount);
  await expectText(page.locator("#validation-status"), "有效");

  await page.locator("[data-lang='en']").click();
  await expectText(page.locator("h1"), "Privacy Banner Builder");
  await expectText(page.locator("#validation-status"), "Valid");

  console.log("Builder interaction smoke test passed.");
} finally {
  if (browser) await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
