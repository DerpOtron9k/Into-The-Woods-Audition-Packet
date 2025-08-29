// /api/submify.js — Robust multipart proxy with guaranteed confirmation redirect
// Next.js Pages API (Node runtime)

export const config = { api: { bodyParser: false } };

// Upstream endpoint (Submify inbox) and confirmation page
const SUBMIFY_URL = 'https://submify.vercel.app/Staheli.Andrew.G%40gmail.com';
const CONFIRM_URL = 'https://intothewoods.vercel.app/#submitted';

// Utility: read the entire incoming request stream into a Buffer
async function readBodyBuffer(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  try {
    // Health/compat
    if (req.method === 'GET') {
      res.status(303).setHeader('Location', CONFIRM_URL).end();
      return;
    }
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      res.status(405).end('Method Not Allowed');
      return;
    }

    // Require content-type for multipart/form-data parsing upstream
    const contentType = req.headers['content-type'];
    if (!contentType) {
      console.error('submify: missing content-type');
      res.status(303).setHeader('Location', CONFIRM_URL).end();
      return;
    }

    // Read and forward the body as a Buffer (avoids streaming/duplex issues)
    const bodyBuf = await readBodyBuffer(req);

    // Forward only necessary headers; compute length explicitly
    const forwardHeaders = {
      'content-type': contentType,
      'content-length': String(bodyBuf.length),
      // Optional: carry through a minimal UA
      'user-agent': (req.headers['user-agent'] || 'submify-proxy')
    };

    // Protective timeout
    const controller = new AbortController();
    const TIMEOUT_MS = 60_000;
    const t = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let upstream;
    try {
      upstream = await fetch(SUBMIFY_URL, {
        method: 'POST',
        headers: forwardHeaders,
        body: bodyBuf,
        redirect: 'manual',
        signal: controller.signal
      });
    } finally {
      clearTimeout(t);
    }

    // Log non-OK for diagnostics, but do not break UX
    if (!upstream || !upstream.ok) {
      let msg = '';
      try { msg = upstream ? await upstream.text() : ''; } catch (_) {}
      console.error('submify upstream non-ok',
        upstream && upstream.status, (msg || '').slice(0, 500));
    }

    // Normalize to a stable confirmation redirect regardless of upstream result
    res.status(303).setHeader('Location', CONFIRM_URL).end();
  } catch (err) {
    console.error('submify proxy error:', err && (err.stack || String(err)));
    // Always present confirmation to the user
    try { res.status(303).setHeader('Location', CONFIRM_URL).end(); } catch (_) {}
  }
}
