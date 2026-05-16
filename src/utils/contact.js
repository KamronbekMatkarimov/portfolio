export async function sendContactForm({ name, message }) {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, message }),
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    // ignore
  }

  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }

  return true;
}
