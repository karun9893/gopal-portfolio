# Gopal Patidar — Cinematic Portfolio

A cinematic, scroll-driven single-page portfolio for **Gopal Patidar**, Software Engineer & AI Product Builder.

## Structure

- `public/index.html` — single-page site (intro sequence, chapters, case studies, contact, final sequence)
- `public/css/style.css` — dark premium theme, scroll-reveal animations, reduced-motion support
- `public/js/main.js` — typing intro, reveal observer, interactive SVG skill graph, hero network canvas
- `.gitlab-ci.yml` — deploys `public/` via GitLab Pages on the default branch

## Before going live — add your personal assets

Place these files in `public/assets/` (create the folder):

| File | Used by |
| --- | --- |
| `Gopal_Patidar_Resume.pdf` | Resume download buttons (hero + contact) |
| `project-ticket.png` | AI Ticket Intelligence Platform screenshot (replaces the CSS mockup automatically) |
| `project-northstar.png` | NorthStar screenshot (replaces the CSS mockup automatically) |

If a screenshot is missing, an elegant CSS dashboard mockup is shown instead — no broken images.

Also update the **LinkedIn URL** in `public/index.html` (search for `linkedin.com/in/`) to your exact profile.

## Deployment

Merging to `main` triggers the `pages` job. The site is then available under **Deploy → Pages**.

## Local preview

```sh
cd public && python3 -m http.server 8000
```
