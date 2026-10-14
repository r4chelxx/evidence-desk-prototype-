# Evidence Desk Prototype

Static MVP prototype for **Evidence Desk**, a workflow tool for investigative journalists.

The prototype tests whether a journalist can move from:

`investigative question -> jurisdiction -> hypotheses -> evidence blocks -> sources/requests -> deadlines -> editorial queue -> transparency log -> request comparison -> follow-ups -> gaps -> claims -> QA -> methodology`

without backend, login, external integrations or AI.

The Pages demo remains static. An optional local Node 24 adapter now connects the
structured LAI form to OpenAI Responses with a strict JSON schema. It is **not
configured or active on Pages**. It compares pasted request/response/attachment
text, proposes per-item findings and a follow-up draft, and preserves the analysis
when the reporter saves the review. Binary attachments, OCR and automatic legal
deadline calculation are not implemented. A model assessment is not proof that all
requested items were identified; the reporter must review coverage and excerpts.

## Run the optional AI adapter

Configure `OPENAI_API_KEY` and `OPENAI_MODEL` in the server environment, then run
`node server.mjs` and open `http://127.0.0.1:4173`. Never put a key in frontend code
or Git. Without these variables, the form remains available for manual review.
The adapter binds only to loopback, serves an explicit file allowlist, rejects
foreign origins, limits input size and does not log document text or provider
errors. It requests `store: false`; this is not a guarantee of zero provider
retention. Documents are sent only when the reporter presses the analysis button.

This adapter is for local evaluation. A hosted release requires an authenticated
backend, access controls and usage limits. Do not expose this local adapter through
a public tunnel. The current GitHub Pages demo cannot execute a server or hold an
API key. No provider call has been verified against a live account yet.

Run contract and failure-handling checks with `node --test tests/*.test.mjs`.

## Current prototype scope

- Investigation dashboard with Brazil and U.S. test cases, filters and empty-state handling.
- Portuguese-first interface with a PT/EN/ES language toggle for the product UI, including dashboard, navigation and core workflow tabs.
- Simulated "New investigation" flow with required-field validation and generated workspace preview.
- MVP roadmap separating current static validation, persistence and later AI assistance.
- Explicit prototype limits for static storage, legal deadlines and AI so demos do not overpromise.
- JSON export for the current investigation, creating a portable static data snapshot before backend work.
- Jurisdiction/access-law guidance for each case.
- Language/localization guidance for English, Portuguese and Spanish use.
- Central question, secondary questions and working hypotheses for each investigation.
- Evidence blocks, sources and request tracking.
- Deadline and escalation guidance.
- Original deadline vs current checkpoint tracking for active LAI/FOIA follow-ups.
- Action plan tab for reporter-reviewed next steps tied to protocols, sources and documented events.
- Editorial queue that combines active checkpoints, review items and priority actions into one human-decision view.
- Transparency log for procedural LAI/FOIA history, appeals, partial responses and missing attachments.
- Request vs response comparison.
- Human-reviewed follow-up draft examples.
- Freshness/review warnings for stale or active investigations.
- QA checklist with blockers and editorial risk.
- QA v0.2 model with operational glossary, closed status lists, evidence-relation rules, functional coverage and testable acceptance criteria.
- Method safeguards that prevent missing data, silence or forwarding from becoming unsupported claims.
- Investigation compass with a visual thread from question to proof, gaps and publishable claims.
- Case audit panel that flags duplicate IDs, missing request-response links, weak claims, overdue requests and QA blockers.
- Editorial pre-test panel for checking whether a case is ready for a full workflow test.
- Full-flow QA test script linking overview, plan, requests, claims and methodology checks.
- Reporting map that connects hypotheses, evidence needs and likely source paths.
- Evidence inventory that keeps unmapped evidence blocks visible during planning.
- Request board that groups LAI/FOIA/public-record requests by process status.
- Structured per-request LAI review: reporter records a response or occurrence, checks completeness and saves a linked transparency event. Scenario guidance is predefined; documentary AI is not connected.
- Procedural claims use explicit role metadata; mentioning LAI or a protocol does not automatically exclude a substantive finding.
- Editorial claim decision cards for advance, caveat or hold decisions before publication.
- Desktop test rail inside each investigation so reviewers can move through the flow, QA and methodology without losing context.
- Story-in-progress panel that translates pitch, evidence, blockers and publishable angle into a clearer path toward the final story.
- Dedicated Story/Matéria workspace that groups narrative blocks, claims for publication, caveats and blockers before the methodology export.
- Mobile investigation context card so the current workflow area stays visible when the sidebar guide is hidden.
- Claim-to-evidence matrix with "supports / contradicts / limits" relation tracking.
- Markdown methodological note preview/copy flow, including sources, source types and limits.
- Dashboard testing guide with tasks, feedback questions and acceptance criteria.

## Open locally

Open `index.html` in a browser, or run a lightweight static server:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173
```

## Publish on GitHub Pages

This folder is static. It can be published directly from the repository root or `/docs` folder, depending on GitHub Pages settings.

See `GITHUB_PAGES_DEPLOY.md`.

## Current test cases

- Violence obstetrics and public data transparency in Bahia, Brazil.
- School technology contracts and public accountability in the United States.

## Product rule

Evidence Desk does not file FOIA/LAI requests, send e-mails or decide whether a claim is proven. It organizes the workflow and prepares reporter-reviewed drafts, while editorial judgment stays with the journalist.

The "New investigation" screen is intentionally non-persistent in this static prototype. It is meant to test onboarding language, required fields and whether journalists understand the structure before backend work begins.

## Files

- `index.html`: static entry point.
- `app.js`: UI rendering and interactions.
- `data.js`: mock investigations.
- `styles.css`: interface styles.
- `GITHUB_PAGES_DEPLOY.md`: deployment instructions.
