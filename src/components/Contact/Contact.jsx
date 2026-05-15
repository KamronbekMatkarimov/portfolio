import { useState } from "react";
import "./Contact.css";
import { SectionHeader } from "../ui/SectionHeader/SectionHeader";
import { Card } from "../ui/Card/Card";
import { Button } from "../ui/Button/Button";
import { useToast } from "../ui/Toast/ToastContext";

const LINKS = [
  {
    title: "GitHub",
    subtitle: "KamronbekMatkarimov",
    href: "https://github.com/KamronbekMatkarimov",
  },
  { title: "Telegram", subtitle: "@matkarimovff", href: "https://t.me/matkarimovff" },
  {
    title: "Instagram",
    subtitle: "@matkarimovff",
    href: "https://www.instagram.com/matkarimovff/",
  },
  { title: "Email", subtitle: "matkarimovkamron10@gmail.com", href: "mailto:matkarimovkamron10@gmail.com" },
];

export function Contact({ t }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setForm({ name: "", email: "", message: "" });
      toast.push(t.contact.sent);
    }, 450);
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionHeader eyebrow="Contact" title={t.contact.title} subtitle="Friendly, quick, and direct." />

        <div className="contact">
          <div className="contact__left">
            <h3 className="contact__title">{t.contact.social}</h3>
            <div className="contact__cards">
              {LINKS.map((l) => (
                <a key={l.title} className="contact__card" href={l.href} target="_blank" rel="noreferrer">
                  <Card className="contact__cardInner">
                    <div className="contact__cardTop">
                      <span className="contact__cardTitle">{l.title}</span>
                      <span className="contact__arrow" aria-hidden="true">
                        →
                      </span>
                    </div>
                    <span className="contact__cardSub">{l.subtitle}</span>
                  </Card>
                </a>
              ))}
            </div>
          </div>

          <Card className="contact__formCard">
            <h3 className="contact__title">{t.contact.form}</h3>
            <form className="contact__form" onSubmit={onSubmit}>
              <Field
                label={t.contact.name}
                value={form.name}
                onChange={(v) => setForm((p) => ({ ...p, name: v }))}
                autoComplete="name"
              />
              <Field
                label={t.contact.email}
                type="email"
                value={form.email}
                onChange={(v) => setForm((p) => ({ ...p, email: v }))}
                autoComplete="email"
              />
              <Field
                label={t.contact.message}
                textarea
                value={form.message}
                onChange={(v) => setForm((p) => ({ ...p, message: v }))}
              />

              <Button type="submit" disabled={loading}>
                {t.contact.send}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, type = "text", textarea = false, autoComplete }) {
  const id = `f_${label.replace(/\s+/g, "_").toLowerCase()}`;
  return (
    <label className="contact__field" htmlFor={id}>
      <span className="contact__label">{label}</span>
      {textarea ? (
        <textarea
          id={id}
          className="contact__input contact__textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
        />
      ) : (
        <input
          id={id}
          className="contact__input"
          value={value}
          type={type}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
        />
      )}
    </label>
  );
}

