import "./Card.css";

export function Card({ as: Tag = "div", className = "", ...props }) {
  const classes = ["ui-card", className].filter(Boolean).join(" ");
  return <Tag className={classes} {...props} />;
}

