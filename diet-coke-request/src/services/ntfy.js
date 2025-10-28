// NTFY service: send a high-priority push to a public topic.
// Falls back to env VITE_NTFY_TOPIC if topic arg is omitted.

const DEFAULT_TIMEOUT_MS = 8000;

export async function sendNtfy({
  topic = "himylove-dietcoke-102508",        // e.g. "himylove-dietcoke-102508"
  title = "Diet Coke",
  message = `🚨 Your wife wants a Diet Coke!  Sent: ${now()}`,
  priority = 5,
  tags = ["bell"],
  timeoutMs = DEFAULT_TIMEOUT_MS,
} = {}) {
  if (!topic) throw new Error("NTFY topic missing (set VITE_NTFY_TOPIC or pass topic)");

  const url = `https://ntfy.sh/${encodeURIComponent(topic)}`;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        "X-Title": title,
        "X-Priority": String(priority),       // 1..5
        "X-Tags": tags.join(","),             // optional emoji tags
      },
      body: message,
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`NTFY failed: ${res.status}`);
    return res;
  } finally {
    clearTimeout(id);
  }
}

const now = () =>
  new Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',     // MM/DD/YY
    timeStyle: 'medium',    // HH:MM:SS (24-hour)
    hour12: true
  }).format(new Date()).replace(',', ''); // Drop the comma

