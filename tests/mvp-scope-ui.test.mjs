import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";

test("core renderer keeps future request workspace out of navigation and actions", async () => {
  const source = await fs.readFile(new URL("../app.js", import.meta.url), "utf8");
  const start = source.indexOf("function renderInvestigation()");
  const end = source.indexOf("function renderTab(item)", start);
  assert.ok(start >= 0 && end > start);
  const coreRenderer = source.slice(start, end);
  assert.doesNotMatch(coreRenderer, /\["requests",/);
  assert.doesNotMatch(coreRenderer, /data-tab=["']requests["']/);
});

test("request renderer remains available as preserved future code", async () => {
  const source = await fs.readFile(new URL("../app.js", import.meta.url), "utf8");
  assert.match(source, /function renderRequestsWorkspace\(/);
});
