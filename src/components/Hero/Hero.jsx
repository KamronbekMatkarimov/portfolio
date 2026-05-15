import { useEffect, useMemo, useState } from "react";
import "./Hero.css";
import { Badge } from "../ui/Badge/Badge";
import { Button } from "../ui/Button/Button";

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Hero({ t }) {
  const roles = useMemo(() => t.hero.roles, [t]);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRoleIndex((i) => (i + 1) % roles.length);
    }, 2500);
    return () => window.clearInterval(id);
  }, [roles.length]);

  return (
    <section className="hero section" aria-label="Hero">
      <div className="container hero__inner">
        <div className="hero__orbs" aria-hidden="true">
          <div className="hero__orb hero__orb--a" />
          <div className="hero__orb hero__orb--b" />
          <div className="hero__orb hero__orb--c" />
        </div>

        <div className="hero__content">
          <Badge tone="accent" className="hero__badge">
            {t.hero.availability}
          </Badge>

          <h1 className="hero__title">Kamron Matkarimov</h1>

          <p className="hero__role" aria-live="polite">
            <span className="hero__roleText" key={roles[roleIndex]}>
              {roles[roleIndex]}
            </span>
          </p>

          <p className="hero__bio">{t.hero.bio}</p>

          <div className="hero__cta">
            <Button onClick={() => scrollToId("projects")} variant="primary" size="lg">
              {t.hero.ctaProjects}
            </Button>
            <Button
              onClick={() => window.dispatchEvent(new CustomEvent("km_open_chat"))}
              variant="ghost"
              size="lg"
            >
              {t.hero.ctaChat}
            </Button>
          </div>
        </div>

        <button className="hero__scroll" type="button" onClick={() => scrollToId("about")}>
          <span className="hero__scrollDot" aria-hidden="true" />
          <span className="hero__scrollText">{t.hero.scroll}</span>
        </button>
      </div>
    </section>
  );
}

