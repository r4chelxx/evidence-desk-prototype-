# Evidence Desk Prototype

Static MVP prototype for **Evidence Desk**, a workflow tool for investigative journalists.

The prototype tests whether a journalist can move from:

`investigative question -> hypotheses -> evidence blocks -> sources/requests -> deadlines -> request comparison -> gaps -> claims -> methodology`

without backend, login, external integrations or AI.

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

## Files

- `index.html`: static entry point.
- `app.js`: UI rendering and interactions.
- `data.js`: mock investigations.
- `styles.css`: interface styles.
- `GITHUB_PAGES_DEPLOY.md`: deployment instructions.
