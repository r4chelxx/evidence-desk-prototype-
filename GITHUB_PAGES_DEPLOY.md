# GitHub Pages deployment

This prototype is a static site. It does not need a build step.

## Option 1: Upload through GitHub web UI

1. Create a new GitHub repository, for example `evidence-desk-prototype`.
2. Upload all files from this folder to the repository root:
   - `index.html`
   - `404.html`
   - `.nojekyll`
   - `README.md`
   - `src/`
3. Go to repository settings.
4. Open **Pages**.
5. In **Build and deployment**, choose:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
6. Save.

The site should become available at:

```text
https://YOUR-USERNAME.github.io/evidence-desk-prototype/
```

## Option 2: Deploy from local git

```bash
git init
git add .
git commit -m "Create Evidence Desk static prototype"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/evidence-desk-prototype.git
git push -u origin main
```

Then enable GitHub Pages from `main` and `/root`.

## Notes

- This prototype has no backend.
- All test content is stored in `src/data.js`.
- Interface logic is in `src/app.js`.
- Styling is in `src/styles.css`.
- It is safe to host as a public static prototype as long as no private documents or real sensitive data are added.

