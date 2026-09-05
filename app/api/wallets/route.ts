import { NextResponse } from 'next/server';
import { getOrCreateUser, listWallets, upsertWallet } from '@/lib/db';
import { getOrCreateSupabaseUser, isSupabaseConfigured, listSupabaseWallets, upsertSupabaseWallet } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const user = new URL(request.url).searchParams.get('user');
  if (!user) return NextResponse.json({ error: 'user is required' }, { status: 400 });
  const record = isSupabaseConfigured ? await getOrCreateSupabaseUser(user) : getOrCreateUser(user);
  const wallets = isSupabaseConfigured ? await listSupabaseWallets(Number(record.id)) : listWallets(Number(record.id));
  return NextResponse.json({ wallets });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (!body.user || !body.provider || !body.address) {
    return NextResponse.json({ error: 'user, provider, and address are required' }, { status: 400 });
  }
  const user = isSupabaseConfigured ? await getOrCreateSupabaseUser(body.user) : getOrCreateUser(body.user);
  const wallet = isSupabaseConfigured
    ? await upsertSupabaseWallet(Number(user.id), body.provider, body.address, body.chain ?? 'multi-chain')
    : upsertWallet(Number(user.id), body.provider, body.address, body.chain ?? 'multi-chain');
  return NextResponse.json({ wallet }, { status: 201 });
}
