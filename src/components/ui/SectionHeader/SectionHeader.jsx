import "./SectionHeader.css";

export function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <header className="ui-sectionHeader">
      {eyebrow ? <p className="ui-sectionHeader__eyebrow">{eyebrow}</p> : null}
      <h2 className="ui-sectionHeader__title">{title}</h2>
      {subtitle ? <p className="ui-sectionHeader__subtitle">{subtitle}</p> : null}
    </header>
  );
}

