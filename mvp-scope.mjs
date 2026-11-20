/**
 * Scope contract for the RJI MVP.
 *
 * The MVP keeps the private investigation workflow focused on material,
 * verification, editorial decisions and export. Request/FOIA workflows remain
 * implemented as future modules, but are deliberately not part of the core UI.
 */
export const MVP_CORE_TABS = Object.freeze([
  "overview",
  "context",
  "plan",
  "editorial",
  "claims",
  "story",
  "methodology",
  "qa",
]);

export const FUTURE_ONLY_TABS = Object.freeze(["requests"]);

export const MVP_CORE_CAPABILITIES = Object.freeze([
  "private-investigation",
  "local-materials",
  "literal-search",
  "citations",
  "human-review",
  "export-delete",
]);

export const FUTURE_ONLY_CAPABILITIES = Object.freeze([
  "lai-foia",
  "community",
  "feed",
  "relationships",
]);

export function isMvpCoreTab(tab) {
  return MVP_CORE_TABS.includes(tab);
}

export function isFutureOnlyTab(tab) {
  return FUTURE_ONLY_TABS.includes(tab);
}

export function normalizeMvpTab(tab) {
  return isMvpCoreTab(tab) ? tab : "overview";
}
