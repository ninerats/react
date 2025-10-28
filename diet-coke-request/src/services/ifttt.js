// IFTTT Webhook trigger: pushes a mobile app notification on your iPhone.
// Uses env vars by default (client-visible).
// Free plan supports this (2 applets limit).

const DEFAULT_TIMEOUT_MS = 8000;

export async function triggerIFTTT({
  event = import.meta.env.VITE_IFTTT_EVENT || "diet_coke",
  key = import.meta.env.VITE_IFTTT_KEY,   // put your key in .env
  json = null,                            // optional { value1, value2, value3 }
  timeoutMs = DEFAULT_TIMEOUT_MS,
} = {}) {
  if (!key) throw new Error("IFTTT key missing (set VITE_IFTTT_KEY)");
  const url = `https://maker.ifttt.com/trigger/${encodeURIComponent(event)}/with/key/${encodeURIComponent(key)}`;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: json ? { "Content-Type": "application/json" } : undefined,
      body: json ? JSON.stringify(json) : undefined,
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`IFTTT failed: ${res.status}`);
    return res;
  } finally {
    clearTimeout(id);
  }
}
