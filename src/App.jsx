import { Suspense, lazy, useEffect, useMemo } from "react";
import "./App.css";
import { Navbar } from "./components/Navbar/Navbar";
import { Hero } from "./components/Hero/Hero";
import { About } from "./components/About/About";
import { Skills } from "./components/Skills/Skills";
import { Projects } from "./components/Projects/Projects";
import { Contact } from "./components/Contact/Contact";
import { Footer } from "./components/Footer/Footer";
import { ToastProvider } from "./components/ui/Toast/Toast";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { LANGS, translations } from "./i18n/translations";
import { CustomCursor } from "./components/CustomCursor/CustomCursor";
import { ScrollProgress } from "./components/ScrollProgress/ScrollProgress";

const AIChat = lazy(() => import("./components/AIChat/AIChat"));

const THEMES = ["dark", "light", "ocean", "forest"];

function normalizeLang(lang) {
  if (LANGS.includes(lang)) return lang;
  return "en";
}

function normalizeTheme(theme) {
  if (THEMES.includes(theme)) return theme;
  return "dark";
}

export default function App() {
  const [lang, setLang] = useLocalStorage("km_lang", "en");
  const [theme, setTheme] = useLocalStorage("km_theme", "dark");

  const t = useMemo(() => translations[normalizeLang(lang)], [lang]);

  useEffect(() => {
    const t = normalizeTheme(theme);
    document.documentElement.setAttribute("data-theme", t);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      const colors = { dark: "#08080f", light: "#f4f3ee", ocean: "#050d1a", forest: "#070f07" };
      meta.setAttribute("content", colors[t] || colors.dark);
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("lang", normalizeLang(lang));
  }, [lang]);

  return (
    <ToastProvider>
      <ScrollProgress />
      <CustomCursor />

      <Navbar
        t={t}
        lang={normalizeLang(lang)}
        onLangChange={setLang}
        theme={normalizeTheme(theme)}
        onThemeChange={setTheme}
      />

      <main>
        <Hero t={t} />
        <About t={t} />
        <Skills t={t} />
        <Projects t={t} />
        <Contact t={t} />
      </main>

      <Footer t={t} />

      <Suspense fallback={null}>
        <AIChat t={t} lang={normalizeLang(lang)} />
      </Suspense>
    </ToastProvider>
  );
}
