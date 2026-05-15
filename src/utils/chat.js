export async function sendChat({ messages, lang, signal }) {
  const trimmed = Array.isArray(messages) ? messages.slice(-12) : [];

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
  return data.reply;
}

