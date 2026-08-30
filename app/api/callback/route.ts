import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  if (!code) {
    return new NextResponse('Missing code', { status: 400 });
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: process.env.OAUTH_GITHUB_CLIENT_ID,
      client_secret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const tokenData = await tokenRes.json();

  if (tokenData.error || !tokenData.access_token) {
    return new NextResponse(
      `OAuth error: ${tokenData.error_description || tokenData.error || 'unknown error'}`,
      { status: 400 }
    );
  }

  // Decap's popup protocol: it expects a postMessage in this exact shape
  // once it receives the "authorizing:github" handshake back from itself.
  const payload = JSON.stringify({ token: tokenData.access_token, provider: 'github' });
  const message = `authorization:github:success:${payload}`;

  const html = `<!doctype html>
<html><body>
<script>
  (function() {
    function receiveMessage(e) {
      window.opener.postMessage(${JSON.stringify(message)}, e.origin);
      window.removeEventListener('message', receiveMessage, false);
    }
    window.addEventListener('message', receiveMessage, false);
    window.opener.postMessage('authorizing:github', '*');
  })();
</script>
</body></html>`;

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
}
