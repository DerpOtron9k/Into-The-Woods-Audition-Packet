// /api/submify.js  — Safe streaming proxy (ESM)
export const config = {
  api: {
    // If you are on Next.js < 14, you might need to disable body parsing differently.
    bodyParser: false
  }
};

const SUBMIFY_URL = 'https://submify.vercel.app/Staheli.Andrew.G%40gmail.com';
const CONFIRM_URL = '/#submitted'; // or full absolute https://intothewoods.vercel.app/#submitted

export default async function handler(req, res) {
  try {
    // Immediately handle non-POSTs:
    if (req.method === 'GET') {
      res.status(303).setHeader('Location', CONFIRM_URL).end();
      return;
    }
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      res.status(405).end('Method Not Allowed');
      return;
    }

    // Setup a timeout so the function doesn't hang too long waiting for upstream.
    const controller = new AbortController();
    // Choose a conservative timeout (ms). Vercel allows up to 120s, but shorter protects UX.
    const TIMEOUT_MS = 25_000;
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    // Build headers to forward. Remove Host (let fetch set it).
    const forwardHeaders = {};
    for (const [k, v] of Object.entries(req.headers || {})) {
      if (k === 'host') continue;
      forwardHeaders[k] = v;
    }

    // IMPORTANT: forward req as the body (stream) when possible to avoid buffering large bodies.
    // In Node runtime, passing the `req` stream to fetch's body will stream. If your runtime disallows
    // streaming, this may still buffer — monitor logs and adjust.
    const upstream = await fetch(SUBMIFY_URL, {
      method: 'POST',
      headers: forwardHeaders,
      body: req,            // stream the incoming request through
      redirect: 'manual',   // inspect Location header instead of auto-following
      signal: controller.signal
    });

    clearTimeout(timeout);

    // If upstream sent a redirect Location, normalize and send 303 to the browser.
    const upstreamLocation = upstream.headers.get('location');
    if (upstreamLocation) {
      // Normalize bare fragments like "#submitted" -> "/#submitted"
      const safeLocation = upstreamLocation.startsWith('#') ? '/' + upstreamLocation : upstreamLocation;
      res.status(303).setHeader('Location', safeLocation).end();
      return;
    }

    // No redirect from upstream: if it succeeded, redirect to confirmation; otherwise show small error body.
    if (upstream.ok) {
      res.status(303).setHeader('Location', CONFIRM_URL).end();
      return;
    }

    // Upstream returned non-ok and no redirect: return status text but still prefer redirect UX.
    // For safety, prefer redirect to confirmation; but log details for debug.
    const text = await upstream.text().catch(() => '');
    console.error('submify upstream non-ok, status=', upstream.status, 'body=', text);
    res.status(303).setHeader('Location', CONFIRM_URL).end();
    return;
  } catch (err) {
    // Log stack trace to Vercel logs (so you can inspect it).
    console.error('submify proxy error:', err && (err.stack || String(err)));
    // Always redirect the browser to the confirmation so users are not stuck on Vercel's error UI.
    try { res.status(303).setHeader('Location', CONFIRM_URL).end(); } catch (_) { /* noop */ }
    return;
  }
}
