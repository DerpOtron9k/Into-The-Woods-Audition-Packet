// /api/submify.js
// Root-level Vercel Serverless Function for static sites.
// Forwards the raw multipart body to Submify and passes through redirects.

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // Read raw multipart bytes (keeps file uploads intact)
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const body = Buffer.concat(chunks);

  // Forward to Submify; do not auto-follow redirects
  const upstream = await fetch('https://submify.vercel.app/Staheli.Andrew.G%40gmail.com', {
    method: 'POST',
    headers: { 'content-type': req.headers['content-type'] || 'application/octet-stream' },
    body,
    redirect: 'manual'
  });

  const location = upstream.headers.get('location');

  // Pass Submify's redirect (e.g., your _next URL) directly to the browser
  if (upstream.status >= 300 && upstream.status < 400 && location) {
    res.setHeader('Location', location);
    return res.status(upstream.status).end();
  }

  // Otherwise mirror upstream body/status
  const text = await upstream.text();
  return res.status(upstream.status).send(text);
}
