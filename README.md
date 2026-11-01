<div align="center">

# Adarsh Singh Chauhan · GitHub Dashboard

[![Live Dashboard](https://img.shields.io/badge/OPEN%20LIVE%20DASHBOARD-Visit%20Vercel-9BCB70?style=for-the-badge&logo=vercel&logoColor=111111)](https://github-dashboard-olive-one.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Adarsh--Singh--Chauhan-161b22?style=flat&logo=github)](https://github.com/Adarsh-Singh-Chauhan)
[![Live data](https://img.shields.io/badge/Data-GitHub%20Public%20API-2f855a?style=flat&logo=github)](https://docs.github.com/en/rest)
[![Built with React](https://img.shields.io/badge/Built%20with-React%2019-149eca?style=flat&logo=react)](https://react.dev/)
[![Deployed on Vercel](https://img.shields.io/badge/Deploy-Vercel-111111?style=flat&logo=vercel)](https://vercel.com/)

**Live URL:** https://github-dashboard-olive-one.vercel.app/

</div>

A live view of my public GitHub profile, repositories, languages and recent activity.

---

## Overview

This project turns a public GitHub profile into a useful engineering dashboard. It fetches profile and repository information directly from GitHub's public REST API, then presents it in a searchable, responsive interface.

The visual direction is intentionally restrained: graphite surfaces, clear typography, compact metadata and subtle motion—more like a developer's workspace than a template-heavy landing page.

## What it shows

- **Profile snapshot** — avatar, public profile details and follower counts.
- **Repository explorer** — public repositories with search, language filtering and sorting.
- **Repository signals** — stars, forks, primary language and last update time.
- **Language mix** — language distribution calculated from public repository byte counts.
- **Recent activity** — recent events returned by GitHub's public events endpoint.
- **Engineering profile** — current focus areas, selected skills and career context.
- **Responsive layout** — desktop, tablet and mobile layouts with reduced-motion support.

## Tech stack

| Area | Technologies |
| --- | --- |
| UI | React 19, TypeScript, Vite |
| Styling | Tailwind CSS 4, custom CSS design system |
| Motion & interaction | CSS transitions and accessible micro-interactions |
| Icons | Lucide React |
| Data | GitHub REST API (public endpoints) |
| Hosting | Vercel |

## Run locally

Requirements: Node.js 20+ and pnpm.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Create a production build:

```bash
pnpm run build
```

The Vite frontend is generated in `dist/public`. The dashboard uses public GitHub endpoints and does not require a personal access token or expose private repository data.

## Data notes

- Repository cards include public, non-fork, non-archived repositories.
- Repository counts and follower counts come from the GitHub profile endpoint.
- Stars, forks and language byte counts are aggregated from public repositories.
- Recent activity reflects GitHub's public events feed; it is not a complete contribution history.
- GitHub unauthenticated API limits apply. The dashboard caches successful data in the current browser session for a short period.

## Deployment

Production is built as a static Vite site on Vercel and is connected to this GitHub repository.

- **Production URL:** https://github-dashboard-olive-one.vercel.app/
- **Branch:** `main`
- **Build:** `pnpm run build`
- **Output:** `dist/public`

Vercel creates production deployments from the latest GitHub `main` commit. The frontend uses GitHub's public REST API; private repository data is not requested.

---

<div align="center">

Built by **Adarsh Singh Chauhan** · Software Development Engineer

[GitHub](https://github.com/Adarsh-Singh-Chauhan) · [LinkedIn](https://www.linkedin.com/in/adarsh-singh-5189b9283/) · [Portfolio](https://adarsh-engineering-portfolio-rust.vercel.app/)

</div>
