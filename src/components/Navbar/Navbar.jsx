import { useEffect, useMemo, useState } from "react";
import "./Navbar.css";

const THEMES = [
  { id: "dark", label: "Dark", short: "D" },
  { id: "light", label: "Light", short: "L" },
  { id: "ocean", label: "Ocean", short: "O" },
  { id: "forest", label: "Forest", short: "F" },
];

const LANGS = [
  { id: "en", label: "EN" },
  { id: "ru", label: "RU" },
  { id: "uz", label: "UZ" },
];

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Navbar({ t, lang, onLangChange, theme, onThemeChange }) {
  const [scrolled, setScrolled] = useState(false);

  const links = useMemo(
    () => [
      { id: "about", label: t.nav.about },
      { id: "skills", label: t.nav.skills },
      { id: "projects", label: t.nav.projects },
      { id: "contact", label: t.nav.contact },
    ],
    [t],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={["nav", scrolled ? "nav--scrolled" : ""].filter(Boolean).join(" ")}>
      <div className="container nav__inner">
        <a className="nav__logo" href="#top" onClick={(e) => e.preventDefault()}>
          <span aria-hidden="true">K.</span>
          <span className="sr-only">Kamron Matkarimov</span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {links.map((l) => (
            <button key={l.id} className="nav__link" type="button" onClick={() => scrollToId(l.id)}>
              {l.label}
            </button>
          ))}
        </nav>

        <div className="nav__controls">
          <div className="nav__group" role="group" aria-label="Language">
            <span className="nav__groupLabel" aria-hidden="true">
              Lang
            </span>
            {LANGS.map((l) => (
              <button
                key={l.id}
                type="button"
                className={["nav__pill", l.id === lang ? "is-active" : ""].filter(Boolean).join(" ")}
                aria-pressed={l.id === lang}
                onClick={() => onLangChange(l.id)}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="nav__group" role="group" aria-label="Theme">
            <span className="nav__groupLabel" aria-hidden="true">
              Theme
            </span>
            {THEMES.map((th) => (
              <button
                key={th.id}
                type="button"
                className={["nav__pill nav__pill--theme", th.id === theme ? "is-active" : ""]
                  .filter(Boolean)
                  .join(" ")}
                aria-pressed={th.id === theme}
                title={th.label}
                onClick={() => onThemeChange(th.id)}
              >
                <span className="nav__pillFull">{th.label}</span>
                <span className="nav__pillShort" aria-hidden="true">
                  {th.short}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
