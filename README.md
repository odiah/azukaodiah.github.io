# Deploying to GitHub Pages

## 1. Create the repo

- Go to github.com → New repository
- Name it exactly `YOUR-USERNAME.github.io` (this exact naming is what makes GitHub serve it automatically as a website — e.g. if your GitHub username is `azukaodiah`, the repo must be named `azukaodiah.github.io`)
- Public, no README/gitignore needed (you already have these files)

## 2. Upload the files

Easiest way with no command line:
- On the new repo's page, click **"uploading an existing file"**
- Drag in all files from this folder (`index.html`, `ambiance.html`, `personality-design.html`, `publications.html`, `cv.html`, `style.css`, `script.js`)
- Commit directly to `main`

(If you're comfortable with git/terminal: `git init`, `git add .`, `git commit -m "site"`, `git remote add origin <repo url>`, `git push -u origin main`.)

## 3. Turn on Pages

- Repo → Settings → Pages
- Source: Deploy from branch → `main` → `/ (root)` → Save
- Your site goes live in 1–2 minutes at `https://YOUR-USERNAME.github.io`

## 4. Things to replace before it's "done"

- [ ] `index.html` — swap the 3 `.photo-slot` placeholder boxes for real `<img src="...">` photos
- [ ] `index.html` — the 4 social links (`Google Scholar`, `ORCID`, `LinkedIn`, `ResearchGate`) currently point to `#` — paste in your real profile URLs
- [ ] `publications.html` — the two `replace with DOI link` links need your real DOI URLs
- [ ] `cv.html` — add your actual CV as `assets/Azuka_Odiah_CV.pdf` (create an `assets` folder, drop the PDF in)
- [ ] Double check the "in prep" publication blurbs still match where those papers currently stand

Everything else — text, layout, colors, the light-cycle panel in the hero — is finished and will work as soon as it's live. No build step, no dependencies beyond two Google Fonts loaded via CDN link in each page's `<head>`.
