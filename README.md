# Evidence Desk Prototype

Static MVP prototype for **Evidence Desk**, a workflow tool for investigative journalists.

The prototype tests whether a journalist can move from:

`investigative question -> jurisdiction -> hypotheses -> evidence blocks -> sources/requests -> deadlines -> editorial queue -> transparency log -> request comparison -> follow-ups -> gaps -> claims -> QA -> methodology`

without backend, login, external integrations or AI.

## Current prototype scope

- Investigation dashboard with Brazil and U.S. test cases, filters and empty-state handling.
- Portuguese-first interface with a PT/EN/ES language toggle for the product UI, including dashboard, navigation and core workflow tabs.
- Simulated "New investigation" flow with required-field validation and generated workspace preview.
- MVP roadmap separating current static validation, persistence and later AI assistance.
- Explicit prototype limits for static storage, legal deadlines and AI so demos do not overpromise.
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
- QA v0.2 model with operational glossary, closed status lists, evidence-relation rules and testable acceptance criteria.
- Method safeguards that prevent missing data, silence or forwarding from becoming unsupported claims.
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
