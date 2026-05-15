import { useEffect, useMemo, useState } from "react";
import "./About.css";
import { SectionHeader } from "../ui/SectionHeader/SectionHeader";
import { Card } from "../ui/Card/Card";
import { useIntersection } from "../../hooks/useIntersection";

function useCounter(target, startWhen) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!startWhen) return;
    let raf = 0;
    const duration = 900;
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, startWhen]);

  return value;
}

export function About({ t }) {
  const { ref, isIntersecting } = useIntersection({ threshold: 0.15 });
  const stats = useMemo(() => t.about.stats, [t]);

  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHeader eyebrow="Profile" title={t.about.title} subtitle="Self-made, scalable mindset." />

        <div className="about" ref={ref}>
          <Card className="about__bio">
            {t.about.bio.split("\n\n").map((p) => (
              <p key={p} className="about__p">
                {p}
              </p>
            ))}
          </Card>

          <div className="about__stats">
            {stats.map((s) => (
              <StatCard key={s.label} stat={s} start={isIntersecting} />
            ))}
          </div>

          <Card className="about__timeline">
            <h3 className="about__timelineTitle">{t.about.timelineTitle}</h3>
            <ol className="about__timelineList">
              {t.about.timeline.map((item) => (
                <li key={item} className="about__timelineItem">
                  <span className="about__dot" aria-hidden="true" />
                  <span className="about__timelineText">{item}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, start }) {
  const value = useCounter(stat.value, start);
  return (
    <Card className="about__stat">
      <div className="about__statValue">
        {value}
        {stat.suffix}
      </div>
      <div className="about__statLabel">{stat.label}</div>
    </Card>
  );
}

