// /api/submify.js — Safe streaming proxy (Next.js Pages API, Node runtime)
export const config = { api: { bodyParser: false } };

// Upstream endpoint and confirmation location
const SUBMIFY_URL = 'https://submify.vercel.app/Staheli.Andrew.G%40gmail.com';
const CONFIRM_URL = 'https://intothewoods.vercel.app/#submitted';

export default async function handler(req, res) {
  try {
    // Non-POST: send user to confirmation page
    if (req.method === 'GET') {
      res.status(303).setHeader('Location', CONFIRM_URL).end();
      return;
    }
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      res.status(405).end('Method Not Allowed');
      return;
    }

    // Conservative timeout to protect UX
    const controller = new AbortController();
    const TIMEOUT_MS = 45_000;
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);// /api/submify.js — Safe streaming proxy (Next.js Pages API, Node runtime)
export const config = { api: { bodyParser: false } };

// Upstream endpoint and confirmation URL
const SUBMIFY_URL = 'https://submify.vercel.app/Staheli.Andrew.G%40gmail.com';
const CONFIRM_URL = 'https://intothewoods.vercel.app/#submitted';

export default async function handler(req, res) {
  try {
    // Redirect GETs to confirmation (health-check shortcut)
    if (req.method === 'GET') {
      res.status(303).setHeader('Location', CONFIRM_URL).end();
      return;
    }
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      res.status(405).end('Method Not Allowed');
      return;
    }

    // Require Content-Type so the upstream can parse multipart/form-data correctly
    const contentType = req.headers['content-type'];
    if (!contentType) {
      console.error('Missing Content-Type');
      res.status(303).setHeader('Location', CONFIRM_URL).end();
      return;
    }

    // Forward only safe headers; preserve Content-Type
    const forwardHeaders = {};
    for (const [k, v] of Object.entries(req.headers || {})) {
      const key = k.toLowerCase();
      if (key === 'host' || key === 'content-length' || key === 'transfer-encoding' ||
          key === 'connection' || key === 'accept-encoding') continue;
      forwardHeaders[key] = v;
    }
    forwardHeaders['content-type'] = contentType;

    // Protective timeout (optional)
    const controller = new AbortController();
    const TIMEOUT_MS = 45_000;
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    // CRITICAL: duplex: "half" is required when streaming a Node request body to fetch
    const upstream = await fetch(SUBMIFY_URL, {
      method: 'POST',
      headers: forwardHeaders,
      body: req,                 // stream incoming multipart/form-data
      redirect: 'manual',
      duplex: 'half',
      signal: controller.signal
    });

    clearTimeout(timeout);

    // If upstream provided a redirect, honor it (normalized)
    const loc = upstream.headers.get('location');
    if (loc) {
      const safe = loc.startsWith('#') ? CONFIRM_URL : loc;
      res.status(303).setHeader('Location', safe).end();
      return;
    }

    // Fallback: always return confirmation redirect to keep UX consistent
    if (!upstream.ok) {
      const text = await upstream.text().catch(() => '');
      console.error('Submify non-ok:', upstream.status, text?.slice(0, 500));
    }
    res.status(303).setHeader('Location', CONFIRM_URL).end();
  } catch (err) {
    console.error('Proxy error:', err && (err.stack || String(err)));
    try { res.status(303).setHeader('Location', CONFIRM_URL).end(); } catch (_) {}
  }
}


    // Forward only safe headers; let fetch compute content-length, etc.
    const forwardHeaders = {};
    for (const [k, v] of Object.entries(req.headers || {})) {
      const key = k.toLowerCase();
      if (
        key === 'host' ||
        key === 'content-length' ||
        key === 'transfer-encoding' ||
        key === 'connection' ||
        key === 'accept-encoding'
      ) continue;
      forwardHeaders[key] = v;
    }

    // Stream the incoming multipart/form-data to upstream
    const upstream = await fetch(SUBMIFY_URL, {
      method: 'POST',
      headers: forwardHeaders,
      body: req,            // Node IncomingMessage stream (supported in Node runtime)
      redirect: 'manual',   // inspect upstream Location
      signal: controller.signal
    });

    clearTimeout(timeout);

    // If upstream gave a redirect, normalize and relay it; else always go to CONFIRM_URL
    const upstreamLocation = upstream.headers.get('location');
    if (upstreamLocation) {
      const safeLocation = upstreamLocation.startsWith('#')
        ? CONFIRM_URL  // prefer absolute confirmation over bare fragment
        : upstreamLocation;
      res.status(303).setHeader('Location', safeLocation).end();
      return;
    }

    // If upstream was ok or not, prefer stable UX: redirect to confirmation
    if (!upstream.ok) {
      const text = await upstream.text().catch(() => '');
      console.error('submify upstream non-ok:', upstream.status, text?.slice(0, 500));
    }
    res.status(303).setHeader('Location', CONFIRM_URL).end();
  } catch (err) {
    console.error('submify proxy error:', err && (err.stack || String(err)));
    try { res.status(303).setHeader('Location', CONFIRM_URL).end(); } catch (_) {}
  }
}
