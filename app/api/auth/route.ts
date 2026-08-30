import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const redirectUri = `${request.nextUrl.origin}/api/callback`;
  const scope = 'repo,user';
  const state = Math.random().toString(36).slice(2);

  const authUrl =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${scope}` +
    `&state=${state}`;

  return NextResponse.redirect(authUrl);
}
