import "./Projects.css";
import { FEATURED_PROJECTS } from "../../data/projects";
import { SectionHeader } from "../ui/SectionHeader/SectionHeader";
import { Card } from "../ui/Card/Card";
import { Badge } from "../ui/Badge/Badge";

export function Projects({ t }) {
  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHeader eyebrow={t.projects.eyebrow} title={t.projects.title} subtitle={t.projects.subtitle} />

        <div className="projects__grid">
          {FEATURED_PROJECTS.map((p) => (
            <ProjectCard key={p.id} project={p} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, t }) {
  return (
    <Card
      className="projects__card projects__tilt"
      onMouseMove={(e) => tilt(e.currentTarget, e)}
      onMouseLeave={(e) => resetTilt(e.currentTarget)}
    >
      <div className="projects__cardTop">
        <h3 className="projects__name">{project.name}</h3>
        <Badge tone="surface" className="projects__status">
          {t.projects.status[project.status] || project.status}
        </Badge>
      </div>
      <p className="projects__desc">{project.description}</p>
      <div className="projects__tags">
        {project.stack.map((tech) => (
          <span key={tech} className="projects__tag">
            {tech}
          </span>
        ))}
      </div>
      {project.link ? (
        <a className="projects__link" href={project.link} target="_blank" rel="noreferrer">
          {t.projects.viewProject} →
        </a>
      ) : (
        <span className="projects__link projects__link--muted">{t.projects.private}</span>
      )}
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
