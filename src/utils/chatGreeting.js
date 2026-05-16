const GREETING_ONLY =
  /^(salom|assalomu\s*alaykum|va\s*alaykum|rahmat|qalay|qaley|qanday|qandaysiz|yaxshimisiz|hayr|hello|hi|hey|привет|здравствуйте|здравствуй|добрый\s*(день|вечер|утро))[\s!.?]*$/i;

export function normalizeUserText(text) {
  return String(text || "")
    .trim()
    .replace(/\uFEFF/g, "")
    .replace(/\s+/g, " ");
}

export function isGreetingMessage(text) {
  const s = normalizeUserText(text);
  if (!s || s.length > 48) return false;
  return GREETING_ONLY.test(s);
}

/** Language of the user's message (not UI). */
export function detectMessageLang(text) {
  const s = normalizeUserText(text).toLowerCase();
  if (/[ғқў]/.test(s) || /\b(salom|assalomu|rahmat|qalay|qanday|yordam|loyiha)\b/.test(s)) return "uz";
  if (/[а-яё]/.test(s)) return "ru";
  if (isGreetingMessage(s) && !/[а-яё]/.test(s) && /\b(salom|assalomu|qalay|rahmat)\b/.test(s)) return "uz";
  return null;
}

const BAD_UZ_REPLY =
  /\b(self-taught|fullstack developer|clean code|production-ready|qishloq|skalib|o'rinida o'qishdan|o'zimonaviy|kahve)\b/i;

export function isBadGreetingReply(reply, messageLang) {
  const r = String(reply || "").trim();
  if (!r) return true;
  if (messageLang === "uz" && BAD_UZ_REPLY.test(r)) return true;
  if (messageLang === "uz" && r.length > 220) return true;
  return false;
}

export function pickGreetingLang(messageText, uiLang) {
  return detectMessageLang(messageText) || uiLang || "en";
}
