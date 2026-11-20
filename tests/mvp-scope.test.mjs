import test from "node:test";
import assert from "node:assert/strict";
import {
  MVP_CORE_TABS,
  FUTURE_ONLY_TABS,
  MVP_CORE_CAPABILITIES,
  FUTURE_ONLY_CAPABILITIES,
  isMvpCoreTab,
  isFutureOnlyTab,
  normalizeMvpTab,
} from "../mvp-scope.mjs";

test("MVP core exposes only investigation workflow tabs", () => {
  assert.deepEqual(MVP_CORE_TABS, [
    "overview", "context", "plan", "editorial",
    "claims", "story", "methodology", "qa",
  ]);
  assert.deepEqual(FUTURE_ONLY_TABS, ["requests"]);
  assert.equal(isMvpCoreTab("plan"), true);
  assert.equal(isMvpCoreTab("requests"), false);
  assert.equal(isFutureOnlyTab("requests"), true);
  assert.equal(normalizeMvpTab("requests"), "overview");
});

test("future capabilities are explicit without being part of the core contract", () => {
  assert.ok(MVP_CORE_CAPABILITIES.includes("literal-search"));
  assert.ok(MVP_CORE_CAPABILITIES.includes("human-review"));
  assert.ok(FUTURE_ONLY_CAPABILITIES.includes("lai-foia"));
  assert.ok(FUTURE_ONLY_CAPABILITIES.includes("community"));
});
