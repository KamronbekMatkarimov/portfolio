import { useEffect, useMemo, useRef, useState } from "react";
import "./Navbar.css";
import { Button } from "../ui/Button/Button";

const THEMES = [
  { id: "dark", label: "Dark" },
  { id: "light", label: "Light" },
  { id: "ocean", label: "Ocean" },
  { id: "forest", label: "Forest" },
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
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overlayRef = useRef(null);

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

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

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

        <div className="nav__right">
          <div className="nav__seg" role="group" aria-label="Language">
            {LANGS.map((l) => (
              <button
                key={l.id}
                type="button"
                className={["nav__segBtn", l.id === lang ? "is-active" : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => onLangChange(l.id)}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="nav__seg" role="group" aria-label="Theme">
            {THEMES.map((th) => (
              <button
                key={th.id}
                type="button"
                className={["nav__segBtn", th.id === theme ? "is-active" : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => onThemeChange(th.id)}
              >
                {th.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {open ? (
        <div
          ref={overlayRef}
          className="navOverlay"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === overlayRef.current) setOpen(false);
          }}
        >
          <div className="navOverlay__panel" onClick={(e) => e.stopPropagation()}>
            <div className="navOverlay__top">
              <span className="navOverlay__mark">K.</span>
              <Button variant="ghost" onClick={() => setOpen(false)} aria-label="Close menu">
                Close
              </Button>
            </div>

            <div className="navOverlay__links" role="navigation" aria-label="Mobile">
              {links.map((l, i) => (
                <button
                  key={l.id}
                  type="button"
                  className="navOverlay__link"
                  style={{ animationDelay: `${60 + i * 60}ms` }}
                  onClick={() => {
                    setOpen(false);
                    scrollToId(l.id);
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>

            <div className="navOverlay__bottom">
              <div className="navOverlay__row">
                <span className="navOverlay__label">Language</span>
                <div className="nav__seg" role="group" aria-label="Language">
                  {LANGS.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      className={["nav__segBtn", l.id === lang ? "is-active" : ""]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => onLangChange(l.id)}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="navOverlay__row">
                <span className="navOverlay__label">Theme</span>
                <div className="nav__seg" role="group" aria-label="Theme">
                  {THEMES.map((th) => (
                    <button
                      key={th.id}
                      type="button"
                      className={["nav__segBtn", th.id === theme ? "is-active" : ""]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => onThemeChange(th.id)}
                    >
                      {th.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

