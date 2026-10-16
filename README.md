# Tejitha Kristem · UX portfolio

Static site built with [Astro](https://astro.build). No backend, almost no JavaScript.

## Run locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
```

## Deploy on Vercel

Import this repo in Vercel. It detects Astro automatically
(build command `npm run build`, output `dist`). No settings needed.

## Where things live

- `src/pages/` – one file per page (home, work, about, resume, case studies)
- `src/data/projects.ts` – project names, one-liners and thumbnails
- `src/styles/` – design tokens and styles
- `public/images/` – images (swap in originals with the same file names)
- `public/Tejitha-Kristem-Resume.pdf` – the resume download
