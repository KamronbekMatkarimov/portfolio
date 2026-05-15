import "./Footer.css";

export function Footer({ t }) {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__text">
          {t.footer.built} — {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

