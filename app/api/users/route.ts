import { NextResponse } from 'next/server';
import { getOrCreateUser } from '@/lib/db';
import { getOrCreateSupabaseUser, isSupabaseConfigured } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (!body.externalId || typeof body.externalId !== 'string') {
    return NextResponse.json({ error: 'externalId is required' }, { status: 400 });
  }
  const user = isSupabaseConfigured
    ? await getOrCreateSupabaseUser(body.externalId, body.displayName)
    : getOrCreateUser(body.externalId, body.displayName);
  return NextResponse.json({ user }, { status: 201 });
}
