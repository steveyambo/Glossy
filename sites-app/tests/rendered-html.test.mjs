import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders the JAWNAH storefront with product and social-order content", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>JAWNAH — Gloss haute brillance<\/title>/i);
  assert.match(html, /Révélez l’éclat/);
  assert.match(html, /Lip Gloss Star/);
  assert.match(html, /WhatsApp/);
  assert.match(html, /Snapchat/);
  assert.doesNotMatch(html, /Stripe|PayPal|carte bancaire/i);
});

test("renders the complete administration dashboard", async () => {
  const response = await render("/admin");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Vue d’ensemble/);
  assert.match(html, /Chiffre d’affaires/);
  assert.match(html, /Alertes stock/);
  assert.match(html, /Dernières ventes/);
});
