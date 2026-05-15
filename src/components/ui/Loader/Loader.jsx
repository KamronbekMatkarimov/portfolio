import "./Loader.css";

export function Loader({ label = "Loading" }) {
  return (
    <div className="ui-loader" role="status" aria-live="polite" aria-label={label}>
      <span className="ui-loader__dot" />
      <span className="ui-loader__dot" />
      <span className="ui-loader__dot" />
    </div>
  );
}

export function Skeleton({ className = "" }) {
  return <div className={["ui-skeleton", className].filter(Boolean).join(" ")} />;
}

