import "./Badge.css";

export function Badge({ as: Tag = "span", className = "", tone = "accent", ...props }) {
  const classes = ["ui-badge", `ui-badge--${tone}`, className].filter(Boolean).join(" ");
  return <Tag className={classes} {...props} />;
}

