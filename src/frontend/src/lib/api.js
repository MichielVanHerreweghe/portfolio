/* api.js — thin client for the Portfolio backend.
 *
 * The site is served same-origin behind a reverse proxy that forwards /api/* to
 * the .NET backend (nginx in prod, the Vite dev-server proxy in `astro dev`),
 * so requests use relative paths by default and need neither CORS nor a widened
 * CSP. Set PUBLIC_API_BASE_URL at build time to call a cross-origin API instead
 * (e.g. "https://api.example.com") — no code changes required. */

const BASE = (import.meta.env.PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");

/** Build a versioned API URL: api(`reads/current`) -> `${BASE}/api/v1/reads/current`. */
const api = (path) => `${BASE}/api/v1/${path}`;

/**
 * Fetch the books currently being read.
 * @returns {Promise<Array<{ title: string, slug: string|null, author: string|null, coverImageUrl: string|null }>>}
 */
export async function getCurrentReads(signal) {
  const res = await fetch(api("reads/current"), {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!res.ok) throw new Error(`reads/current failed: ${res.status}`);
  return res.json();
}

/**
 * Send a contact message.
 * @param {{ senderName: string, senderEmailAddress: string, message: string }} payload
 * @returns {Promise<void>} resolves on success, throws on validation/server error.
 */
export async function sendContactMail(payload, signal) {
  const res = await fetch(api("mail/contact"), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
    signal,
  });
  if (!res.ok) throw new Error(`mail/contact failed: ${res.status}`);
}
