import { useEffect, useRef } from "react";
import "./ScrollProgress.css";

export function ScrollProgress() {
  const ref = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const update = () => {
      rafRef.current = 0;
      const el = ref.current;
      if (!el) return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const max = (document.documentElement.scrollHeight || 1) - window.innerHeight;
      const p = max <= 0 ? 0 : Math.min(1, Math.max(0, scrollTop / max));
      el.style.transform = `scaleX(${p})`;
    };

    const onScroll = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="scrollProgress" aria-hidden="true">
      <div ref={ref} className="scrollProgress__bar" />
    </div>
  );
}

