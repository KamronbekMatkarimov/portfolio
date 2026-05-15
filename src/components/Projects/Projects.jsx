import { useMemo } from "react";
import "./Projects.css";
import { SectionHeader } from "../ui/SectionHeader/SectionHeader";
import { Card } from "../ui/Card/Card";
import { Button } from "../ui/Button/Button";
import { Badge } from "../ui/Badge/Badge";
import { Skeleton } from "../ui/Loader/Loader";
import { useGitHub } from "../../hooks/useGitHub";

const LANG_COLORS = {
  Python: "#3572A5",
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
};

function formatName(name) {
  return String(name || "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export function Projects({ t }) {
  const { repos, status, error, refetch } = useGitHub({ perPage: 9 });

  const cards = useMemo(() => {
    if (!Array.isArray(repos)) return [];
    return repos.map((r) => ({
      id: r.id,
      name: r.name,
      prettyName: formatName(r.name),
      url: r.html_url,
      description: r.description || "No description provided.",
      language: r.language || "—",
      stars: r.stargazers_count ?? 0,
      forks: r.forks_count ?? 0,
    }));
  }, [repos]);

  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHeader eyebrow="GitHub" title={t.projects.title} subtitle={t.projects.subtitle} />

        {status === "loading" ? <LoadingGrid /> : null}

        {status === "error" ? (
          <Card className="projects__state">
            <p className="projects__stateTitle">Couldn’t load GitHub repositories.</p>
            <p className="projects__stateText">{error?.message || "Unknown error"}</p>
            <Button onClick={refetch}>{t.projects.retry}</Button>
          </Card>
        ) : null}

        {status === "success" && cards.length === 0 ? (
          <Card className="projects__state">
            <p className="projects__stateTitle">{t.projects.empty}</p>
            <Button onClick={refetch}>{t.projects.retry}</Button>
          </Card>
        ) : null}

        {status === "success" && cards.length > 0 ? (
          <div className="projects__grid">
            {cards.map((c) => (
              <RepoCard key={c.id} repo={c} t={t} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function LoadingGrid() {
  return (
    <div className="projects__grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="projects__card">
          <div className="projects__cardTop">
            <Skeleton className="projects__skTitle" />
            <Skeleton className="projects__skBadge" />
          </div>
          <Skeleton className="projects__skDesc" />
          <Skeleton className="projects__skDesc projects__skDesc2" />
          <div className="projects__meta">
            <Skeleton className="projects__skMeta" />
            <Skeleton className="projects__skMeta" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function RepoCard({ repo, t }) {
  const langColor = LANG_COLORS[repo.language] || "color-mix(in oklab, var(--accent), transparent 10%)";

  return (
    <Card
      className="projects__card projects__tilt"
      style={{ "--langColor": langColor }}
      onMouseMove={(e) => tilt(e.currentTarget, e)}
      onMouseLeave={(e) => resetTilt(e.currentTarget)}
    >
      <div className="projects__cardTop">
        <h3 className="projects__name">{repo.prettyName}</h3>
        <Badge tone="surface" className="projects__lang">
          <span className="projects__langDot" aria-hidden="true" />
          {repo.language}
        </Badge>
      </div>
      <p className="projects__desc">{repo.description}</p>
      <div className="projects__meta">
        <span className="projects__metaItem">
          <span className="projects__metaKey">{t.projects.stars}</span> {repo.stars}
        </span>
        <span className="projects__metaItem">
          <span className="projects__metaKey">{t.projects.forks}</span> {repo.forks}
        </span>
      </div>
      <a className="projects__link" href={repo.url} target="_blank" rel="noreferrer">
        {t.projects.viewOnGitHub} →
      </a>
    </Card>
  );
}

function tilt(card, e) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = card.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  const rx = (-y * 6).toFixed(2);
  const ry = (x * 8).toFixed(2);
  card.style.transform = `translateY(-4px) perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
}

function resetTilt(card) {
  card.style.transform = "";
}

