import {
  detectMessageLang,
  isBadGreetingReply,
  isGreetingMessage,
  normalizeUserText,
  pickGreetingLang,
} from "./chatGreeting";

function lastUserContent(messages) {
  const list = Array.isArray(messages) ? messages : [];
  for (let i = list.length - 1; i >= 0; i -= 1) {
    if (list[i]?.role === "user" && typeof list[i].content === "string") {
      return normalizeUserText(list[i].content);
    }
  }
  return "";
}

function greetingReplyForLang(lang, translations) {
  const key = lang === "uz" || lang === "ru" || lang === "en" ? lang : "en";
  return translations?.[key]?.chat?.greetingReply || translations?.en?.chat?.greetingReply || "";
}

export function resolveGreetingReply({ messages, lang, translations }) {
  const lastUser = lastUserContent(messages);
  if (!isGreetingMessage(lastUser)) return null;
  const replyLang = pickGreetingLang(lastUser, lang);
  const reply = greetingReplyForLang(replyLang, translations);
  return reply || null;
}

export async function sendChat({ messages, lang, signal, translations }) {
  const trimmed = Array.isArray(messages) ? messages.slice(-12) : [];
  const lastUser = lastUserContent(trimmed);

  const localGreeting = resolveGreetingReply({ messages: trimmed, lang, translations });
  if (localGreeting) return localGreeting;

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: trimmed, lang }),
    signal,
  });

  if (!res.ok) {
    let details = "";
    try {
      const data = await res.json();
      details = data?.reply ? `: ${data.reply}` : "";
    } catch {
      // ignore
    }
    throw new Error(`Chat request failed (${res.status})${details}`);
  }

  const data = await res.json();
  if (!data?.reply) throw new Error("Invalid chat response");

  if (isGreetingMessage(lastUser)) {
    const messageLang = detectMessageLang(lastUser) || lang;
    if (isBadGreetingReply(data.reply, messageLang)) {
      const fallback = greetingReplyForLang(messageLang, translations);
      if (fallback) return fallback;
    }
  }

  return data.reply;
}
