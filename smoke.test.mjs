import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

test("admin.html incluye módulos clave del panel", () => {
  const html = fs.readFileSync(path.join(root, "admin.html"), "utf8");
  assert.match(html, /id="admin-asistente"/);
  assert.match(html, /supabase-client\.js/);
});

test("supabase-client admite window.__SUPABASE_CONFIG__", () => {
  const js = fs.readFileSync(path.join(root, "supabase-client.js"), "utf8");
  assert.match(js, /__SUPABASE_CONFIG__/);
});

test("assistant-query expone herramientas de variantes y fechas", () => {
  const ts = fs.readFileSync(
    path.join(root, "supabase", "functions", "assistant-query", "index.ts"),
    "utf8"
  );
  assert.match(ts, /product_variants_by_search/);
  assert.match(ts, /orders_between_dates/);
  assert.match(ts, /assistant_usage_try_increment/);
});

test("existe Edge Function notify-admin-alert", () => {
  const p = path.join(root, "supabase", "functions", "notify-admin-alert", "index.ts");
  assert.ok(fs.existsSync(p), p);
});

test("admin-login.html carga supabase-client", () => {
  const html = fs.readFileSync(path.join(root, "admin-login.html"), "utf8");
  assert.match(html, /supabase-client\.js/);
});
