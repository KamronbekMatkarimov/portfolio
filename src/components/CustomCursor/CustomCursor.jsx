import { useEffect, useRef, useState } from "react";
import "./CustomCursor.css";

function isHoverable(el) {
  if (!el || !(el instanceof Element)) return false;
  if (el.closest("[data-cursor='hover']")) return true;
  return Boolean(el.closest("a,button,input,textarea,select,[role='button']"));
}

export function CustomCursor() {
  const ref = useRef(null);
  const rafRef = useRef(0);
  const posRef = useRef({ x: -100, y: -100 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onMove = (e) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    };

    const onOver = (e) => setActive(isHoverable(e.target));
    const onOut = () => setActive(false);

    const tick = () => {
      rafRef.current = 0;
      const el = ref.current;
      if (!el) return;
      const { x, y } = posRef.current;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mouseout", onOut, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <div ref={ref} className={["custom-cursor", active ? "is-active" : ""].join(" ")} />;
}

