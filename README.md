<div align="center">

# Adarsh Singh Chauhan

**Software Developer · Full-stack Products · AI-enabled Applications**

[![Open live dashboard](https://img.shields.io/badge/OPEN%20LIVE%20DASHBOARD-github--dashboard--olive--one.vercel.app-9fc7b0?style=for-the-badge&logo=vercel&logoColor=111111)](https://github-dashboard-olive-one.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Adarsh--Singh--Chauhan-20252d?style=flat&logo=github)](https://github.com/Adarsh-Singh-Chauhan)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-20252d?style=flat&logo=linkedin)](https://www.linkedin.com/in/adarsh-singh-5189b9283/)

*A live, data-driven snapshot of my public engineering work.*

</div>

---

## About this project

GitHub Dashboard is a compact engineering portfolio built around my public GitHub profile. It brings repository activity, project signals and the technologies I work with into one place—without turning the page into a wall of badges or vanity metrics.

The interface uses clear hierarchy, restrained colour, readable project cards and motion that supports navigation rather than competing with the content.

## What you can explore

- **Profile overview** — public GitHub profile details and community metrics.
- **Repository explorer** — search, filter by language and sort public repositories.
- **Project signals** — stars, forks, primary language and recent update time.
- **Language breakdown** — a byte-count view based on repository language data.
- **Public activity** — recent events returned by GitHub's public events API.
- **Engineering journey** — selected experience, learning focus and areas of work.
- **Responsive interface** — desktop, tablet and mobile layouts, with reduced-motion support.

## Built with

| Layer | Tools |
| --- | --- |
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS 4, custom CSS |
| Interaction | CSS animations, transitions and accessible micro-interactions |
| Icons | Lucide React |
| Data | GitHub REST API |
| Deployment | Vercel |

## Run locally

**Requirements:** Node.js 20+ and pnpm.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Create a production build:

```bash
pnpm run build
```

The Vite build output is generated in `dist/public`. The dashboard reads public GitHub endpoints and does not require a personal access token.

## Data & limitations

- Only public GitHub profile and repository information is requested.
- Forked and archived repositories are excluded from the repository showcase.
- Language percentages are calculated from the language byte counts returned for the repositories queried.
- GitHub's public events endpoint is a short, incomplete activity feed—not a complete contribution history.
- Unauthenticated GitHub API rate limits apply. A short browser-session cache helps avoid unnecessary requests.
- Metrics are fetched from GitHub at runtime; values are not hard-coded.

## Live deployment

<https://github-dashboard-olive-one.vercel.app/>

Production is connected to the `main` branch on Vercel. New commits pushed to the repository trigger a deployment.

---

<div align="center">

**Built by Adarsh Singh Chauhan**

[GitHub](https://github.com/Adarsh-Singh-Chauhan) · [LinkedIn](https://www.linkedin.com/in/adarsh-singh-5189b9283/) · [Portfolio](https://adarsh-engineering-portfolio-rust.vercel.app/)

</div>
