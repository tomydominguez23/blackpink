#!/usr/bin/env node
/**
 * Incrusta el megamenú iPhone en HTML (no depende de app.js en caché).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { renderIphoneMegamenuHtml } from "./iphone-megamenu-html.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const html = renderIphoneMegamenuHtml();

const mountRe =
  /<div class="megamenu-links megamenu-links--iphone megamenu-iphone-gens" data-iphone-megamenu-mount(?: data-iphone-megamenu-ready="1")?>[\s\S]*?<\/div>/g;

const emptyMount =
  '<div class="megamenu-links megamenu-links--iphone megamenu-iphone-gens" data-iphone-megamenu-mount></div>';

const replacement = `<div class="megamenu-links megamenu-links--iphone megamenu-iphone-gens" data-iphone-megamenu-mount data-iphone-megamenu-ready="1">${html}</div>`;

let count = 0;
for (const name of fs.readdirSync(root)) {
  if (!name.endsWith(".html")) continue;
  const file = path.join(root, name);
  let body = fs.readFileSync(file, "utf8");
  if (!body.includes("data-iphone-megamenu-mount")) continue;
  let next = body;
  if (body.includes(emptyMount)) {
    next = body.replaceAll(emptyMount, replacement);
  } else {
    next = body.replace(mountRe, replacement);
  }
  if (next === body) {
    console.warn(`Aviso: no se actualizó megamenú en ${name}`);
    continue;
  }
  fs.writeFileSync(file, next);
  count += 1;
  console.log(`Megamenú iPhone incrustado en ${name}`);
}

if (count === 0) {
  console.error("No se incrustó megamenú en ningún HTML.");
  process.exit(1);
}
