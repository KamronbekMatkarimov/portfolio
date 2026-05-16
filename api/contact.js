/**
 * Contact form → Gmail via SMTP (App Password).
 *
 * Vercel / .env:
 *   GMAIL_USER=matkarimovkamron10@gmail.com
 *   GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx  (Google App Password)
 *   CONTACT_TO=matkarimovkamron10@gmail.com  (optional, defaults to GMAIL_USER)
 */
import nodemailer from "nodemailer";

const RATE = { windowMs: 60_000, max: 5 };
const rateMap = new Map();

function json(res, status, body) {
  if (res.headersSent || res.writableEnded) return;
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function getIp(req) {
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.length) return xf.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

function rateLimit(ip) {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now - entry.ts > RATE.windowMs) {
    rateMap.set(ip, { ts: now, count: 1 });
    return true;
  }
  if (entry.count >= RATE.max) return false;
  entry.count += 1;
  rateMap.set(ip, entry);
  return true;
}

function normalizeSecret(value) {
  let s = String(value ?? "").trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendContactEmail({ name, email, message }) {
  const user = normalizeSecret(process.env.GMAIL_USER);
  const pass = normalizeSecret(process.env.GMAIL_APP_PASSWORD);
  const to = normalizeSecret(process.env.CONTACT_TO) || user;

  if (!user || !pass) {
    const err = new Error("NOT_CONFIGURED");
    err.code = "NOT_CONFIGURED";
    throw err;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  const subject = `Portfolio: message from ${name}`;
  const text = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  const html = `
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
    <hr />
    <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
  `;

  await transporter.sendMail({
    from: `"Portfolio" <${user}>`,
    to,
    replyTo: email,
    subject,
    text,
    html,
  });
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  const ip = getIp(req);
  if (!rateLimit(ip)) {
    return json(res, 429, { ok: false, error: "Too many requests. Try again in a minute." });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const name = String(body?.name || "").trim().slice(0, 120);
    const email = String(body?.email || "").trim().slice(0, 160);
    const message = String(body?.message || "").trim().slice(0, 4000);

    if (!name || !email || !message) {
      return json(res, 400, { ok: false, error: "Fill in all fields." });
    }
    if (!isValidEmail(email)) {
      return json(res, 400, { ok: false, error: "Invalid email address." });
    }

    await sendContactEmail({ name, email, message });
    return json(res, 200, { ok: true });
  } catch (e) {
    if (e?.code === "NOT_CONFIGURED") {
      return json(res, 503, {
        ok: false,
        error: "Email is not configured on the server (GMAIL_USER / GMAIL_APP_PASSWORD).",
      });
    }
    console.error("contact send error:", e?.message || e);
    return json(res, 502, {
      ok: false,
      error: "Could not send email. Check server logs or try Telegram @matkarimovff.",
    });
  }
}
