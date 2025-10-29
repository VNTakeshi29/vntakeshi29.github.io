Takeshi Portfolio (clean UTF-8)

1) Quick view
- Open `index.html` locally or visit GitHub Pages (after deploy).

2) Features
- Dark-first UI with Moon/Sun toggle (SVG icon).
- Projects: Highlights, badges with tooltips, Details modal + Copy domains.
- Discord counters (members/online) auto-fetch; refresh every 60s with ▲/▼ delta.
- Email click-to-copy (toast), Back-to-top, Command Palette (Ctrl/Cmd+K or "/"), smooth scroll, scrollspy.
- SEO/PWA: canonical, sitemap.xml, robots.txt, OG/Twitter card, manifest.webmanifest + icon.

3) Structure
- `index.html` — page content
- `styles.css` — styles, tokens, responsive, print styles
- `script.js` — theme toggle, counters, modal, palette, scrollspy
- `assets/` — avatar, logos, OG, icons
- `.nojekyll` — disable Jekyll on GitHub Pages

4) Customize
- Avatar at `assets/avatar.jpg` (square ≥ 512px).
- Projects in `index.html` under `#projects`.
- Colors: edit `--brand` and `--brand-2` in `styles.css`.
- SEO: update `<title>`, `description`, and OG/Twitter images in `<head>`.

5) Deploy
- GitHub Pages: push to repo `vntakeshi29.github.io`, Settings → Pages → Deploy from a branch → main / root.
- Custom domain: change canonical/OG/sitemap/robots to your domain and configure hosting.

Note: This README is saved as UTF‑8 to avoid mojibake on GitHub.
