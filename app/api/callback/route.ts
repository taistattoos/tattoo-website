import { NextRequest, NextResponse } from 'next/server';
import { OAUTH_STATE_COOKIE } from '@/lib/constants/oauth';
import { getSiteOrigin } from '@/lib/server/site-origin';

function fail(status: number) {
  const response = new NextResponse('Login failed', { status, headers: { 'Cache-Control': 'no-store' } });
  response.cookies.set(OAUTH_STATE_COOKIE, '', { path: '/api', maxAge: 0 });
  return response;
}

// Makes a value safe to place inside an inline <script>.
const toScriptValue = (value: string) => JSON.stringify(value).replace(/</g, '\\u003c');

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const expectedState = request.cookies.get(OAUTH_STATE_COOKIE)?.value;

  // The state must match the cookie set by /api/auth, otherwise this login was not started here.
  if (!code || !state || !expectedState || state !== expectedState) return fail(400);

  let accessToken: unknown;
  try {
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
    accessToken = tokenData.access_token;
  } catch {
    console.error('oauth: token request failed');
    return fail(502);
  }

  if (typeof accessToken !== 'string' || accessToken === '') {
    console.error('oauth: no access token received');
    return fail(400);
  }

  // The token is only ever sent to this site's own origin, never to whoever answers the handshake.
  const origin = getSiteOrigin(request);
  const payload = JSON.stringify({ token: accessToken, provider: 'github' });
  const message = `authorization:github:success:${payload}`;

  const html = `<!doctype html>
<html><body>
<script>
  (function () {
    var targetOrigin = ${toScriptValue(origin)};
    if (!window.opener) return;

    function receiveMessage(e) {
      if (e.origin !== targetOrigin || e.data !== 'authorizing:github') return;
      window.removeEventListener('message', receiveMessage, false);
      window.opener.postMessage(${toScriptValue(message)}, targetOrigin);
    }

    window.addEventListener('message', receiveMessage, false);
    window.opener.postMessage('authorizing:github', targetOrigin);
  })();
</script>
</body></html>`;

  const response = new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer',
    },
  });
  response.cookies.set(OAUTH_STATE_COOKIE, '', { path: '/api', maxAge: 0 });

  return response;
}