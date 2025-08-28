// api/submify.js
// Node.js serverless function on Vercel (root /api). Forwards the raw multipart
// body to Submify and passes through Submify's redirect to your _next URL.

const ALLOWED_ORIGINS = new Set([
  'https://intothewoods.vercel.app',   // production
  'http://localhost:3000',             // local preview, if needed
]);

function setCors(res, origin) {
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin'); // ensure caches key on Origin
}

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  // If you call this endpoint via fetch(), browsers will preflight:
  if (req.method === 'OPTIONS') {
    setCors(res, origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }
  if (req.method !== 'POST') return res.status(405).end();

  // Collect the raw multipart bytes without parsing
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const body = Buffer.concat(chunks);

  // Forward to Submify; keep content-type boundary; do not auto-follow redirects
  const upstream = await fetch('https://submify.vercel.app/Staheli.Andrew.G%40gmail.com', {
    method: 'POST',
    headers: { 'content-type': req.headers['content-type'] || 'application/octet-stream' },
    body,
    redirect: 'manual',
  });

  setCors(res, origin);

  // If Submify returns a 302 with Location (your _next), pass it through
  const location = upstream.headers.get('location');
  if (upstream.status >= 300 && upstream.status < 400 && location) {
    res.setHeader('Location', location);
    return res.status(upstream.status).end();
  }

  // Otherwise mirror status/body (useful if you submit via fetch() for SPA UX)
  const text = await upstream.text();
  return res.status(upstream.status).send(text);
}
