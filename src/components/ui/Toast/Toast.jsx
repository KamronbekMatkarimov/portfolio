import { useCallback, useMemo, useState } from "react";
import "./Toast.css";
import { ToastContext } from "./ToastContext";

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, { durationMs = 2600 } = {}) => {
    const id = uid();
    setToasts((prev) => [...prev, { id, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, durationMs);
  }, []);

  const api = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="ui-toastHost" aria-live="polite" aria-relevant="additions">
        {toasts.map((t) => (
          <div key={t.id} className="ui-toast">
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

