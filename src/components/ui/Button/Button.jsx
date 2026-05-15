import "./Button.css";

export function Button({
  as: Tag = "button",
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const classes = ["ui-button", `ui-button--${variant}`, `ui-button--${size}`, className]
    .filter(Boolean)
    .join(" ");

  return <Tag className={classes} {...props} />;
}

