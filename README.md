# Modernist Notebook Studio

A static 3D notebook web app with page flipping, polaroid-style image/video cards, and page notes.

## Direct browser link (GitHub Pages)

Once this repo is on GitHub and Pages is enabled, your share link will be:

- `https://<github-username>.github.io/<repository-name>/`

Example:

- `https://alex.github.io/notebook-studio/`

This means your girlfriend can open one URL directly in any browser—no download, no Python, no setup.

## One-time setup in GitHub (2 minutes)

1. Push this repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to your default branch (or run the workflow manually in **Actions**).
5. Copy the Pages URL shown in the workflow summary and share it.

## Local development (optional)

You do **not** need this for sharing, but for local testing:

```bash
python3 -m http.server 8000
```

Then open `http://127.0.0.1:8000`.
