import "./Skills.css";
import { SectionHeader } from "../ui/SectionHeader/SectionHeader";
import { Card } from "../ui/Card/Card";

const SKILLS = {
  backend: ["Python", "Django", "Django REST Framework", "PostgreSQL", "Redis"],
  frontend: ["React", "JavaScript", "HTML5", "CSS3"],
  devops: ["Docker", "Git", "GitHub", "Vercel", "Linux"],
  learning: ["Next.js", "TypeScript"],
};

export function Skills({ t }) {
  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHeader eyebrow="Stack" title={t.skills.title} subtitle="Clean code, scalable architecture." />

        <div className="skills">
          <Group title={t.skills.groups.backend} items={SKILLS.backend} />
          <Group title={t.skills.groups.frontend} items={SKILLS.frontend} />
          <Group title={t.skills.groups.devops} items={SKILLS.devops} />
          <Group title={t.skills.groups.learning} items={SKILLS.learning} />
        </div>
      </div>
    </section>
  );
}

function Group({ title, items }) {
  return (
    <Card className="skills__group">
      <h3 className="skills__title">{title}</h3>
      <div className="skills__tags">
        {items.map((s) => (
          <span key={s} className="skills__tag">
            {s}
          </span>
        ))}
      </div>
    </Card>
  );
}

