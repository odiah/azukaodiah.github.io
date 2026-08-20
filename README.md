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



#######

# Updating your live site (odiah.github.io)

Your site is now one continuous page instead of separate tabs, with a sidebar
that jumps to each section. Here's how to push this version live.

## 1. Important — make the CV doc viewable

Before anything else: open the Google Doc → **Share** (top right) → under
"General access," change it from "Restricted" to **"Anyone with the link" →
Viewer**. If you skip this, the CV section on your live site will show a
Google "you need permission" screen instead of your CV, since it's now
embedded publicly.

## 2. Clean up the old files in your repo

Your repo currently has separate page files from the earlier version. Delete
these from GitHub (open each file in the repo → trash-can icon → commit):
- `ambiance.html`
- `personality-design.html`
- `publications.html`
- `cv.html`

Everything they contained now lives inside `index.html`.

## 3. Upload the new files

Upload these 3, overwriting the old ones with the same names:
- `index.html`
- `style.css`
- `script.js`

(Same process as before: repo → Add file → Upload files → drag them in →
commit to `main`.)

## 4. Add your photos

Create a folder in the repo called `assets`, and upload your photos using
these exact filenames — the page is already wired to look for them, so
nothing else needs to change once they're in place:

| File | Used for |
|---|---|
| `assets/icon.jpg` | Small circular icon next to your name in the sidebar, and the browser tab icon |
| `assets/selfie.jpg` | Your portrait in the About section |
| `assets/hobby-band.jpg` | Jazz band photo |
| `assets/hobby-painting.jpg` | One of your African paintings |
| `assets/hobby-bike.jpg` | Biking in Austin |
| `assets/research-ambiance.jpg` | Header image on the Ambiance section |
| `assets/research-personality.jpg` | Header image on the Personality & Design section |
| `assets/pub-1.jpg` through `pub-4.jpg` | Optional small thumbnail next to each publication — skip any you don't have, the layout adjusts automatically if the file is missing |

Any photo you don't upload yet just shows a labeled placeholder box (or, for
publication thumbnails, simply doesn't show at all) — nothing breaks either
way, so you can add these gradually.

## 5. Other placeholders still to fill in

- [ ] The 4 social links (Google Scholar, ORCID, LinkedIn, ResearchGate) in the sidebar footer and Contact section point to `#` — replace with your real profile URLs
- [ ] The two `replace with DOI link` links in Publications

## 6. Adding an interactive chart later

Two spots are already reserved in the page — a dashed "chart-slot" box in
the Ambiance section and one in Personality & Design. When you have real
data, here's a minimal starting point using Chart.js (no build step,
works straight in the browser):

```html
<!-- add once, near the bottom of <head> or right before </body> -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

```html
<!-- replace a .chart-slot div with this -->
<canvas id="ambianceChart" style="max-width:100%;"></canvas>
<script>
new Chart(document.getElementById("ambianceChart"), {
  type: "bar", // or "line", "radar", etc.
  data: {
    labels: ["Lighting", "Color", "Layout", "Materials", "Furniture"],
    datasets: [{
      label: "Ambiance rating",
      data: [7.2, 6.8, 8.1, 5.9, 6.4], // swap in your real numbers
      backgroundColor: "#a8431d"
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } }
  }
});
</script>
```

A couple of things worth keeping in mind once there's real data: keep a
plain HTML table with the same numbers somewhere near the chart (screen
readers and keyboard users can't get much from a canvas element alone),
and if you ever plot more than one series, distinguish them with line
style or pattern too, not just color.

## That's it

No new repo, no renaming — same `odiah.github.io` address. Once you upload
and commit, the live site updates within about a minute.