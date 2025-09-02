// /api/submify.js
export const runtime = 'nodejs';
export const config = { api: { bodyParser: false } };

const SUBMIFY_URL = 'https://submify.vercel.app/staheli.andrew.g%40gmail.com'; // lowercased path
const CONFIRM_URL = 'https://intothewoods.vercel.app/#submitted';

function readBodyBuffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function json_(res, code, obj) {
  res.status(code).setHeader('content-type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(obj));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json_(res, 405, { ok: false, error: 'Method Not Allowed' });

  try {
    const bodyBuf = await readBodyBuffer(req);
    const ct = req.headers['content-type'] || 'application/octet-stream';

    // Abort if upstream stalls
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);

    // Critical: await fetch AND drain the body; force Connection: close
    let upstream, upstreamStatus = 0, upstreamText = '';
    try {
      upstream = await fetch(SUBMIFY_URL, {
        method: 'POST',
        body: bodyBuf,
        headers: {
          'content-type': ct,
          'content-length': String(bodyBuf.length),
          'connection': 'close',
          'cache-control': 'no-store',
          'pragma': 'no-cache',
          'accept': 'text/plain,application/json;q=0.9,*/*;q=0.8',
        },
        redirect: 'manual',
        signal: controller.signal,
      });
      upstreamStatus = upstream.status;
      // Drain the response body to close the socket deterministically
      try { upstreamText = await upstream.text(); } catch {}
    } catch (e) {
      console.error('submify fetch error:', e && (e.stack || String(e)));
    } finally {
      clearTimeout(timer);
    }

    if (!upstream || !upstream.ok) {
      console.error('submify upstream non-ok', upstreamStatus, (upstreamText || '').slice(0, 500));
    }
    res.setHeader('X-Submify-Status', String(upstreamStatus || 0));

    // Preserve UX regardless of upstream status
    res.status(303).setHeader('Location', CONFIRM_URL).end();
  } catch (err) {
    console.error('submify proxy fatal:', err && (err.stack || String(err)));
    try { res.status(303).setHeader('Location', CONFIRM_URL).end(); } catch {}
  }
}
