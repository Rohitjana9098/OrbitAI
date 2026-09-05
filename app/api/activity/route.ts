import { NextResponse } from 'next/server';
import { getOrCreateUser, listActivity } from '@/lib/db';
import { getOrCreateSupabaseUser, isSupabaseConfigured, listSupabaseActivity } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const user = new URL(request.url).searchParams.get('user');
  if (!user) return NextResponse.json({ error: 'user is required' }, { status: 400 });
  const record = isSupabaseConfigured ? await getOrCreateSupabaseUser(user) : getOrCreateUser(user);
  const activity = isSupabaseConfigured
    ? await listSupabaseActivity(Number(record.id))
    : listActivity(Number(record.id));
  return NextResponse.json({ activity });
}
