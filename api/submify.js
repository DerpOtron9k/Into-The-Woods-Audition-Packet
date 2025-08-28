// /api/submify.js
export default async function handler(req, res) {
  try {
    // If landed here by GET, send user to confirmation page
    if (req.method === 'GET') {
      res.status(303).setHeader('Location', '/#submitted').end();
      return;
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST, GET');
      res.status(405).end('Method Not Allowed');
      return;
    }

    // Read raw body (keeps files multipart intact)
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const body = Buffer.concat(chunks);
    const contentType = req.headers['content-type'] || 'application/octet-stream';

    // Forward the POST to Submify (your encoded email path)
    const upstream = await fetch(
      'https://submify.vercel.app/Staheli.Andrew.G%40gmail.com',
      {
        method: 'POST',
        headers: { 'content-type': contentType },
        body,
        redirect: 'manual'
      }
    );

    const upstreamLocation = upstream.headers.get('location');

    // If upstream redirected, normalize location and return 303 so browser GETs it
    if ((upstream.status === 302 || upstream.status === 303 || upstream.status === 301) && upstreamLocation) {
      // If upstream returned only a fragment like "#submitted", make it absolute on your site
      const safeLocation = upstreamLocation.startsWith('#') ? '/' + upstreamLocation : upstreamLocation;
      res.status(303).setHeader('Location', safeLocation).end();
      return;
    }

    // No redirect from upstream — if OK, go to our confirmation, otherwise bubble status
    const text = await upstream.text();
    if (upstream.ok) {
      res.status(303).setHeader('Location', '/#submitted').end();
    } else {
      res.status(upstream.status || 502)
         .setHeader('Content-Type', 'text/plain; charset=utf-8')
         .end(text || 'Upstream error');
    }
  } catch (err) {
    console.error('submify proxy error:', err);
    // Defensive fallback: never show platform 500 to user — redirect to confirmation
    res.status(303).setHeader('Location', '/#submitted').end();
  }
}
