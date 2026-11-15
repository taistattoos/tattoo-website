import type { NextRequest } from 'next/server';

export type JsonBodyResult =
  | { ok: true; body: Record<string, unknown> }
  | { ok: false; status: 413 | 415 | 400; code: 'size' | 'invalid' };

/**
 * Reads a form submission's JSON body defensively:
 * - only `application/json` (a cross-site HTML form can't send that without a CORS preflight)
 * - rejects oversized bodies from the Content-Length header before reading, and re-checks after
 * - must be a plain JSON object
 */
export async function readJsonBody(request: NextRequest, maxBytes: number): Promise<JsonBodyResult> {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().startsWith('application/json')) return { ok: false, status: 415, code: 'invalid' };

  const declared = Number(request.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > maxBytes) return { ok: false, status: 413, code: 'size' };

  const raw = await request.text();
  if (Buffer.byteLength(raw, 'utf-8') > maxBytes) return { ok: false, status: 413, code: 'size' };

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return { ok: false, status: 400, code: 'invalid' };
    return { ok: true, body: parsed as Record<string, unknown> };
  } catch {
    return { ok: false, status: 400, code: 'invalid' };
  }
}
