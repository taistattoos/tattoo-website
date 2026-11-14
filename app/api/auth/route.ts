import { NextRequest, NextResponse } from 'next/server';
import { OAUTH_STATE_COOKIE, OAUTH_STATE_MAX_AGE_SECONDS } from '@/lib/constants/oauth';

export async function GET(request: NextRequest) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;

  if (!clientId) {
    console.error('oauth: client id is not configured');
    return new NextResponse('Login is not available', { status: 500 });
  }

  const state = crypto.randomUUID();

  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', `${request.nextUrl.origin}/api/callback`);
  // "repo" lets Decap commit to the repository. Use "public_repo" instead if the repo is public.
  authUrl.searchParams.set('scope', 'repo');
  authUrl.searchParams.set('state', state);

  const response = NextResponse.redirect(authUrl);
  response.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api',
    maxAge: OAUTH_STATE_MAX_AGE_SECONDS,
  });
  response.headers.set('Cache-Control', 'no-store');

  return response;
}