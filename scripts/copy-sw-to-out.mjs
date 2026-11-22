import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const sw = join(root, "public", "sw.js");
const outDir = join(root, "out");

if (!existsSync(sw)) {
  console.error("public/sw.js missing — run serwist build first");
  process.exit(1);
}

copyFileSync(sw, join(outDir, "sw.js"));
console.log("Copied sw.js → out/");