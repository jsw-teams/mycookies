import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const publicDir = path.join(rootDir, "public");

const files = [
  "privacy-plugin-loader.js",
  "privacy-plugin-banner.css",
  "privacy-plugins.json"
];

const targets = [
  "/opt/account-system/public",
  "/opt/myblog/src",
  "/opt/myblog/static/assets",
  "/opt/dquery/frontend/public",
  "/opt/myfiles/frontend/public/app",
  "/opt/myweb/public"
];

const optionalTargets = [
  "/opt/myblog/public/assets",
  "/opt/dquery/frontend/dist",
  "/opt/myfiles/frontend/dist/app",
  "/opt/myweb/dist"
];

async function copyFileToTarget(file, targetDir) {
  await fs.mkdir(targetDir, { recursive: true });
  await fs.copyFile(path.join(publicDir, file), path.join(targetDir, file));
}

const existingOptionalTargets = [];
for (const targetDir of optionalTargets) {
  try {
    const stat = await fs.stat(targetDir);
    if (stat.isDirectory()) existingOptionalTargets.push(targetDir);
  } catch {
    /* Build output does not exist yet. */
  }
}

const allTargets = [...targets, ...existingOptionalTargets];

for (const targetDir of allTargets) {
  for (const file of files) {
    await copyFileToTarget(file, targetDir);
  }
}

console.log(`Synced ${files.length} privacy-js-gripe files to ${allTargets.length} project locations.`);
