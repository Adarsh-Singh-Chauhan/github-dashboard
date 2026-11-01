import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDot,
  Clock3,
  Code2,
  Cloud,
  ExternalLink,
  GitBranch,
  GitFork,
  Github,
  Globe2,
  GraduationCap,
  Layers3,
  Linkedin,
  Mail,
  MapPin,
  Monitor,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Terminal,
  Users,
  X,
  Zap,
} from "lucide-react";

const USERNAME = "Adarsh-Singh-Chauhan";
const GITHUB = "https://github.com/Adarsh-Singh-Chauhan";
const LINKEDIN = "https://www.linkedin.com/in/adarsh-singh-5189b9283/";
const EMAIL = "adarshsinghchauhan904@gmail.com";
const CACHE_KEY = "asc-github-dashboard-v2";
const CACHE_TTL = 5 * 60 * 1000;

interface GitHubProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  html_url: string;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
  location: string | null;
}

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  updated_at: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  topics: string[];
  languages_url: string;
}

interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: {
    size?: number;
    ref_type?: string;
    action?: string;
    commits?: { message: string }[];
  };
}

interface LanguageStat {
  name: string;
  bytes: number;
}

interface DashboardData {
  profile: GitHubProfile;
  repositories: GitHubRepository[];
  events: GitHubEvent[];
  languages: LanguageStat[];
  fetchedAt: string;
}

const skillGroups = [
  {
    label: "Product engineering",
    items: ["Full-stack development", "Frontend engineering", "Backend systems", "REST APIs"],
  },
  {
    label: "AI & automation",
    items: ["AI applications", "Machine learning", "Agentic workflows", "Vibe coding"],
  },
  {
    label: "Quality & delivery",
    items: ["Software testing", "Cybersecurity", "Cloud deployment", "CI/CD"],
  },
];

const stack = [
  "TypeScript", "JavaScript", "Python", "C++", "React", "Next.js",
  "Node.js", "NestJS", "FastAPI", "PostgreSQL", "MySQL", "Supabase",
  "Docker", "AWS", "Git", "GitHub Actions",
];

const projectDescriptions: Record<string, string> = {
  DOCFORGE: "Document conversion and processing workflows, OCR, PDF extraction and AI-assisted retrieval.",
  PREPIQ: "An AI-assisted career preparation product covering interview practice and guided learning.",
  CyberSentric: "A cybersecurity-focused project exploring anomaly detection and intelligent response workflows.",
  "NEXA---Multimodal-Web-Data-Agent": "A multimodal web data agent built around modern AI application workflows.",
  unisathi: "A role-based campus product concept for students and their wider academic community.",
  "hackverse-ai": "An AI-enabled hackathon ecosystem for collaboration, evaluation and event workflows.",
  "build-ship-survive-hackathon-simulator": "An interactive hackathon simulation focused on product decisions and delivery.",
  "Disease-Prediction-ML": "A machine-learning project exploring disease prediction and classification.",
};

const languageColors: Record<string, string> = {
  TypeScript: "#4d9de0",
  JavaScript: "#e7c85a",
  Python: "#64a5dc",
  Java: "#df8758",
  HTML: "#e77b56",
  CSS: "#9b83dc",
  "C++": "#8a9de8",
  C: "#8b98a9",
  "C#": "#78b87a",
  Go: "#4ab9cf",
  Rust: "#d18a69",
  PHP: "#9a8ac8",
  Shell: "#85ba7a",
};

const number = (value: number) =>
  new Intl.NumberFormat("en-IN", { notation: value >= 10000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(value);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));

const relativeDate = (value: string) => {
  const elapsed = Math.max(0, Date.now() - new Date(value).getTime());
  const minutes = Math.floor(elapsed / 60000);
  if (minutes < 60) return minutes <= 1 ? "just now" : `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(value);
};

async function githubGet<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, {
    signal,
    headers: { Accept: "application/vnd.github+json" },
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("GitHub rate limit reached. Please try again in a few minutes.");
    }
    throw new Error(`GitHub API returned ${response.status} for ${url.split("/").slice(-1)[0]}.`);
  }

  return (await response.json()) as T;
}

function eventDescription(event: GitHubEvent) {
  const repo = event.repo.name.split("/").pop() || event.repo.name;
  const count = event.payload.size || event.payload.commits?.length || 1;
  switch (event.type) {
    case "PushEvent":
      return { title: `Pushed ${count} commit${count === 1 ? "" : "s"}`, detail: repo, icon: GitBranch };
    case "CreateEvent":
      return { title: `Created a ${event.payload.ref_type || "repository reference"}`, detail: repo, icon: Code2 };
    case "PullRequestEvent":
      return { title: `${(event.payload.action || "updated").replace(/^./, (c) => c.toUpperCase())} a pull request`, detail: repo, icon: GitBranch };
    case "IssuesEvent":
      return { title: `${(event.payload.action || "updated").replace(/^./, (c) => c.toUpperCase())} an issue`, detail: repo, icon: CircleDot };
    case "WatchEvent":
      return { title: "Starred a repository", detail: repo, icon: Star };
    case "ForkEvent":
      return { title: "Forked a repository", detail: repo, icon: GitFork };
    case "ReleaseEvent":
      return { title: "Published a release", detail: repo, icon: Zap };
    default:
      return { title: event.type.replace("Event", " event"), detail: repo, icon: Activity };
  }
}

function StatCard({
  label,
  value,
  note,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  note: string;
  icon: typeof Github;
  tone: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className={`stat-icon ${tone}`}><Icon size={17} strokeWidth={1.8} /></span>
        <span className="stat-note">{note}</span>
      </div>
      <strong>{value}</strong>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function RepoCard({ repo, index }: { repo: GitHubRepository; index: number }) {
  const title = repo.name.replace(/[-_]/g, " ");
  const description = projectDescriptions[repo.name] || repo.description || "Public repository — explore the source, implementation and project history.";
  return (
    <a
      className="repo-card"
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      style={{ animationDelay: `${index * 65}ms` }}
    >
      <div className="repo-card-head">
        <span className="repo-folder"><Code2 size={17} /></span>
        <span className="repo-external"><ArrowUpRight size={16} /></span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="repo-topics">
        {repo.language && <span className="language-chip"><i style={{ background: languageColors[repo.language] || "#8a9aaa" }} />{repo.language}</span>}
        {repo.topics.slice(0, 2).map((topic) => <span key={topic} className="topic-chip">{topic}</span>)}
      </div>
      <div className="repo-card-footer">
        <span><Star size={13} /> {number(repo.stargazers_count)}</span>
        <span><GitFork size={13} /> {number(repo.forks_count)}</span>
        <span className="repo-updated">Updated {relativeDate(repo.pushed_at || repo.updated_at)}</span>
      </div>
    </a>
  );
}

function LoadingDashboard() {
  return (
    <main className="page-shell">
      <div className="loading-top"><div className="loading-mark" /><div className="loading-line" /></div>
      <div className="loading-hero skeleton" />
      <div className="loading-stats">{[1, 2, 3, 4].map((item) => <div className="skeleton" key={item} />)}</div>
      <div className="loading-grid">{[1, 2, 3, 4, 5, 6].map((item) => <div className="skeleton" key={item} />)}</div>
    </main>
  );
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [sortMode, setSortMode] = useState<"recent" | "stars">("recent");

  const loadDashboard = useCallback(async (force = false) => {
    const cached = !force ? sessionStorage.getItem(CACHE_KEY) : null;
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as { savedAt: number; data: DashboardData };
        if (Date.now() - parsed.savedAt < CACHE_TTL) {
          setData(parsed.data);
          setIsLoading(false);
          setError(null);
          return;
        }
      } catch {
        sessionStorage.removeItem(CACHE_KEY);
      }
    }

    const controller = new AbortController();
    setIsRefreshing(true);
    setError(null);

    try {
      const [profile, rawRepositories, rawEvents] = await Promise.all([
        githubGet<GitHubProfile>(`https://api.github.com/users/${USERNAME}`, controller.signal),
        githubGet<GitHubRepository[]>(`https://api.github.com/users/${USERNAME}/repos?type=owner&sort=updated&per_page=100`, controller.signal),
        githubGet<GitHubEvent[]>(`https://api.github.com/users/${USERNAME}/events/public?per_page=30`, controller.signal).catch(() => [] as GitHubEvent[]),
      ]);

      const repositories = rawRepositories
        .filter((repo) => !repo.fork && !repo.archived)
        .sort((a, b) => new Date(b.pushed_at || b.updated_at).getTime() - new Date(a.pushed_at || a.updated_at).getTime());

      const languageTotals: Record<string, number> = {};
      await Promise.all(
        repositories.slice(0, 7).map(async (repo) => {
          try {
            const languages = await githubGet<Record<string, number>>(repo.languages_url, controller.signal);
            Object.entries(languages).forEach(([name, bytes]) => {
              languageTotals[name] = (languageTotals[name] || 0) + bytes;
            });
          } catch {
            // A missing language endpoint should not prevent the dashboard from loading.
          }
        }),
      );

      const languages = Object.entries(languageTotals)
        .map(([name, bytes]) => ({ name, bytes }))
        .sort((a, b) => b.bytes - a.bytes)
        .slice(0, 6);

      const next: DashboardData = {
        profile,
        repositories,
        events: rawEvents.filter((event) => event.type !== "PublicEvent").slice(0, 8),
        languages,
        fetchedAt: new Date().toISOString(),
      };

      setData(next);
      setError(null);
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data: next }));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load GitHub data.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const filteredRepositories = useMemo(() => {
    if (!data) return [];
    const filtered = data.repositories.filter((repo) => {
      const searchText = `${repo.name} ${repo.description || ""} ${repo.language || ""} ${repo.topics.join(" ")}`.toLowerCase();
      return searchText.includes(query.toLowerCase()) && (languageFilter === "All" || repo.language === languageFilter);
    });
    return [...filtered].sort((a, b) => sortMode === "stars"
      ? b.stargazers_count - a.stargazers_count
      : new Date(b.pushed_at || b.updated_at).getTime() - new Date(a.pushed_at || a.updated_at).getTime());
  }, [data, languageFilter, query, sortMode]);

  const totalStars = data?.repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0) || 0;
  const totalForks = data?.repositories.reduce((sum, repo) => sum + repo.forks_count, 0) || 0;
  const languagesTotal = data?.languages.reduce((sum, language) => sum + language.bytes, 0) || 1;
  const languageOptions = ["All", ...(data?.languages.map((language) => language.name) || [])];

  if (isLoading && !data) return <LoadingDashboard />;

  if (!data) {
    return (
      <main className="page-shell">
        <div className="error-panel">
          <div className="eyebrow"><span className="eyebrow-dot" /> GITHUB CONNECTOR / STATUS</div>
          <h1>Live data is taking a break.</h1>
          <p>{error || "The GitHub public API did not return a response."}</p>
          <button className="button button-primary" onClick={() => void loadDashboard(true)}><RefreshCw size={15} /> Try again</button>
          <a className="text-link" href={GITHUB} target="_blank" rel="noreferrer">Open GitHub profile <ArrowUpRight size={14} /></a>
        </div>
      </main>
    );
  }

  const profileName = data.profile.name || data.profile.login;
  const fetchedTime = new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit" }).format(new Date(data.fetchedAt));

  return (
    <main className="page-shell">
      <header className="site-nav">
        <a href="#top" className="brand-lockup" aria-label="GitHub dashboard home">
          <span className="brand-mark"><Terminal size={17} /></span>
          <span><b>ASC</b><small>GITHUB DASHBOARD</small></span>
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          <a className="active" href="#overview">Overview</a>
          <a href="#repositories">Repositories</a>
          <a href="#stack">Tech stack</a>
          <a href="#activity">Activity</a>
        </nav>
        <div className="nav-actions">
          <span className="api-status"><i /> LIVE PUBLIC DATA</span>
          <button className="icon-button" onClick={() => void loadDashboard(true)} disabled={isRefreshing} aria-label="Refresh GitHub data" title="Refresh data">
            <RefreshCw size={16} className={isRefreshing ? "spin" : ""} />
          </button>
          <a className="nav-github" href={GITHUB} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a>
        </div>
      </header>

      <section className="hero-section" id="overview">
        <div className="hero-grid-lines" aria-hidden="true" />
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> SOFTWARE ENGINEERING / PROFILE 001</div>
          <div className="hero-kicker">Build with intent. Ship with care.</div>
          <h1>{profileName}<span className="hero-period">.</span></h1>
          <div className="hero-role">SOFTWARE DEVELOPMENT ENGINEER <span>·</span> SOFTWARE ENGINEER</div>
          <p className="hero-description">
            I build practical digital products across full-stack engineering, AI-enabled applications and software quality.
            Interested in the details that make software useful, reliable and ready to ship.
          </p>
          <div className="hero-focus">
            <span>FULL-STACK</span><i /> <span>AI &amp; ML</span><i /> <span>AUTOMATION</span><i /> <span>CYBERSECURITY</span>
          </div>
          <div className="hero-actions">
            <a className="button button-primary" href={GITHUB} target="_blank" rel="noreferrer"><Github size={16} /> Explore GitHub <ArrowUpRight size={14} /></a>
            <a className="button button-secondary" href={LINKEDIN} target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn</a>
            <a className="button button-quiet" href={`mailto:${EMAIL}`}><Mail size={16} /> Get in touch</a>
          </div>
        </div>

        <div className="profile-console">
          <div className="console-top">
            <div className="console-lights"><i /><i /><i /></div>
            <span>profile.runtime</span>
            <span className="console-live"><i /> SYNCED</span>
          </div>
          <div className="profile-identity">
            <div className="avatar-frame">
              <img src={data.profile.avatar_url} alt={profileName} />
              <span className="avatar-presence" />
            </div>
            <div className="profile-identity-copy">
              <strong>{profileName}</strong>
              <span>@{data.profile.login}</span>
              <small><MapPin size={12} /> {data.profile.location || "India"}</small>
            </div>
          </div>
          <div className="console-divider" />
          <div className="console-code">
            <span className="code-muted">const developer = {"{"}</span>
            <span><em>role</em>: <b>"Software Development Engineer"</b>,</span>
            <span><em>focus</em>: <b>["Full-stack", "AI", "Quality"]</b>,</span>
            <span><em>workflow</em>: <b>["plan", "build", "test", "ship"]</b></span>
            <span className="code-muted">{"}"};</span>
          </div>
          <div className="console-bottom">
            <span><Activity size={13} /> Public profile data</span>
            <span>Updated {fetchedTime}</span>
          </div>
        </div>
        <div className="hero-index">01 <span>/ 04</span></div>
      </section>

      <section className="stats-grid" aria-label="GitHub statistics">
        <StatCard label="Public repositories" value={number(data.profile.public_repos)} note="ACCOUNT" icon={Layers3} tone="tone-cyan" />
        <StatCard label="Stars earned" value={number(totalStars)} note="PUBLIC PROJECTS" icon={Star} tone="tone-amber" />
        <StatCard label="Forks" value={number(totalForks)} note="PUBLIC PROJECTS" icon={GitFork} tone="tone-violet" />
        <StatCard label="Followers" value={number(data.profile.followers)} note="COMMUNITY" icon={Users} tone="tone-green" />
      </section>

      <section className="section-block" id="repositories">
        <div className="section-heading">
          <div>
            <div className="eyebrow"><span className="eyebrow-dot" /> OPEN SOURCE / 02</div>
            <h2>Recent repositories<span className="hero-period">.</span></h2>
            <p>Public work, pulled directly from GitHub. Open a project to see its code and history.</p>
          </div>
          <a className="section-link" href={`${GITHUB}?tab=repositories`} target="_blank" rel="noreferrer">All repositories <ArrowUpRight size={15} /></a>
        </div>

        <div className="repo-toolbar">
          <label className="repo-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a repository..." aria-label="Search repositories" /><kbd>/</kbd></label>
          <div className="repo-controls">
            <select value={languageFilter} onChange={(event) => setLanguageFilter(event.target.value)} aria-label="Filter by language">
              {languageOptions.map((language) => <option key={language}>{language}</option>)}
            </select>
            <button className={sortMode === "recent" ? "sort-button selected" : "sort-button"} onClick={() => setSortMode("recent")}>Recently updated</button>
            <button className={sortMode === "stars" ? "sort-button selected" : "sort-button"} onClick={() => setSortMode("stars")}>Most stars</button>
          </div>
        </div>

        {filteredRepositories.length ? (
          <div className="repo-grid">
            {filteredRepositories.slice(0, 9).map((repo, index) => <RepoCard repo={repo} index={index} key={repo.id} />)}
          </div>
        ) : (
          <div className="empty-state"><Search size={19} /><strong>No matching repositories</strong><span>Try another name or language.</span></div>
        )}
        <div className="section-footnote"><span>{filteredRepositories.length} repositories shown</span><span>Forks and archived projects are excluded from this showcase.</span></div>
      </section>

      <section className="lower-grid">
        <div className="section-panel activity-panel" id="activity">
          <div className="panel-heading">
            <div><div className="eyebrow"><span className="eyebrow-dot" /> RECENT SIGNAL</div><h2>Public activity</h2></div>
            <span className="panel-tag">GITHUB EVENTS</span>
          </div>
          {data.events.length ? (
            <div className="activity-list">
              {data.events.slice(0, 7).map((event) => {
                const entry = eventDescription(event);
                const Icon = entry.icon;
                return (
                  <a className="activity-row" href={`https://github.com/${event.repo.name}`} target="_blank" rel="noreferrer" key={event.id}>
                    <span className="activity-icon"><Icon size={15} /></span>
                    <span className="activity-copy"><strong>{entry.title}</strong><small>{entry.detail}</small></span>
                    <time>{relativeDate(event.created_at)}</time>
                    <ArrowUpRight size={13} className="activity-arrow" />
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="empty-state compact"><Activity size={18} /><strong>No recent public events returned.</strong><span>GitHub may temporarily have no events in its public feed.</span></div>
          )}
          <a className="panel-footer-link" href={`${GITHUB}?tab=activity`} target="_blank" rel="noreferrer">View GitHub activity <ArrowUpRight size={14} /></a>
        </div>

        <div className="section-panel languages-panel" id="stack">
          <div className="panel-heading">
            <div><div className="eyebrow"><span className="eyebrow-dot" /> TOOLING / 03</div><h2>Language mix</h2></div>
            <span className="panel-tag">BY BYTE COUNT</span>
          </div>
          {data.languages.length ? (
            <div className="language-list">
              {data.languages.map((language) => {
                const percent = (language.bytes / languagesTotal) * 100;
                return (
                  <div className="language-row" key={language.name}>
                    <div className="language-row-top"><span><i style={{ background: languageColors[language.name] || "#8a9aaa" }} />{language.name}</span><b>{percent.toFixed(1)}%</b></div>
                    <div className="language-track"><span style={{ width: `${percent}%`, background: languageColors[language.name] || "#8a9aaa" }} /></div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state compact"><Code2 size={18} /><strong>Language data unavailable.</strong><span>Try refreshing the dashboard.</span></div>
          )}
          <div className="stack-cloud">
            {stack.map((skill) => <span key={skill}>{skill}</span>)}
          </div>
        </div>
      </section>

      <section className="journey-section">
        <div className="section-heading">
          <div><div className="eyebrow"><span className="eyebrow-dot" /> THE ENGINEERING JOURNEY / 04</div><h2>What I work on<span className="hero-period">.</span></h2></div>
          <span className="section-index">Bhopal, India</span>
        </div>
        <div className="journey-grid">
          <article className="journey-card">
            <span className="journey-icon"><BriefcaseBusiness size={18} /></span>
            <div className="journey-meta">MAY — OCT 2026</div>
            <h3>SDE Intern · CONORG</h3>
            <p>Software and web application development, functional and regression testing, defect tracking, deployment support and technical documentation.</p>
            <span className="journey-status"><Check size={12} /> Internship completed</span>
          </article>
          <article className="journey-card">
            <span className="journey-icon"><GraduationCap size={19} /></span>
            <div className="journey-meta">EXPECTED 2027</div>
            <h3>B.Tech · Computer Science</h3>
            <p>Sagar Institute of Research &amp; Technology, Bhopal · Computer Science &amp; Engineering (Cyber Security).</p>
            <span className="journey-status">Learning in progress</span>
          </article>
          <article className="journey-card">
            <span className="journey-icon"><Sparkles size={18} /></span>
            <div className="journey-meta">CURRENT INTERESTS</div>
            <h3>Build, test, improve</h3>
            <p>Full-stack systems, AI applications, agentic automation, cybersecurity and cloud delivery—with AI-assisted prototyping and engineering review.</p>
            <span className="journey-status">Always learning</span>
          </article>
        </div>
      </section>

      <footer className="site-footer">
        <a href="#top" className="footer-brand"><span className="brand-mark"><Terminal size={16} /></span><b>ASC / ENGINEERING</b></a>
        <span>Public GitHub data · Refreshed {fetchedTime}</span>
        <div><a href={GITHUB} target="_blank" rel="noreferrer">GitHub</a><a href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn</a><a href={`mailto:${EMAIL}`}>Email</a></div>
      </footer>
      <div className="page-bottom-line"><span>DESIGNED FOR BUILDERS</span><span>ADARSH SINGH CHAUHAN · 2026</span><span>DATA SOURCE: GITHUB PUBLIC API</span></div>
      {error && <div className="soft-error"><span>{error}</span><button onClick={() => void loadDashboard(true)}>Retry</button></div>}
    </main>
  );
}
