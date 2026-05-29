import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

test("robots.txt permite indexación pública y bloquea admin", () => {
  const txt = fs.readFileSync(path.join(root, "robots.txt"), "utf8");
  assert.match(txt, /Sitemap: https:\/\/blackpinkphones\.cl\/sitemap\.xml/);
  assert.match(txt, /Disallow: \/admin\.html/);
  assert.doesNotMatch(txt, /Disallow: \/$/m);
});

test("sitemap.xml lista páginas públicas principales", () => {
  const xml = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
  assert.match(xml, /<loc>https:\/\/blackpinkphones\.cl\/<\/loc>/);
  assert.match(xml, /productos\.html/);
  assert.match(xml, /contacto\.html/);
});

test("index.html incluye canonical y datos estructurados", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  assert.match(html, /rel="canonical"/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /ElectronicsStore/);
});

test("admin.html no debe indexarse", () => {
  const html = fs.readFileSync(path.join(root, "admin.html"), "utf8");
  assert.match(html, /noindex/i);
});
