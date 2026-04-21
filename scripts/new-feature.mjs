#!/usr/bin/env node
/**
 * Cross-platform copy of specs/features/_template → specs/features/<name>
 * Usage: npm run feature:new -- my-feature
 *        node scripts/new-feature.mjs my-feature
 */
import { cpSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = join(__dirname, "..");
const templateDir = join(root, "specs", "features", "_template");

const name = process.argv[2];
if (!name || name.includes("/") || name.includes("\\") || name === "." || name === "..") {
  console.error("Usage: npm run feature:new -- <feature-name>");
  process.exit(1);
}

const dest = join(root, "specs", "features", name);
if (existsSync(dest)) {
  console.error(`Target already exists: specs/features/${name}`);
  process.exit(1);
}

cpSync(templateDir, dest, { recursive: true });
console.log(`Created specs/features/${name} from _template`);
