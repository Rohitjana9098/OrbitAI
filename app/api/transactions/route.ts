import { NextResponse } from 'next/server';
import { createTransaction, getOrCreateUser, listTransactions } from '@/lib/db';
import { createSupabaseTransaction, getOrCreateSupabaseUser, isSupabaseConfigured, listSupabaseTransactions } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const user = new URL(request.url).searchParams.get('user');
  if (!user) return NextResponse.json({ error: 'user is required' }, { status: 400 });
  const record = isSupabaseConfigured ? await getOrCreateSupabaseUser(user) : getOrCreateUser(user);
  const transactions = isSupabaseConfigured
    ? await listSupabaseTransactions(Number(record.id))
    : listTransactions(Number(record.id));
  return NextResponse.json({ transactions });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (!body.user || !body.type || !body.detail) {
    return NextResponse.json({ error: 'user, type, and detail are required' }, { status: 400 });
  }
  const user = isSupabaseConfigured ? await getOrCreateSupabaseUser(body.user) : getOrCreateUser(body.user);
  const input = {
    userId: Number(user.id),
    walletId: typeof body.walletId === 'number' ? body.walletId : undefined,
    type: body.type,
    detail: body.detail,
    status: typeof body.status === 'string' ? body.status : undefined,
    txHash: typeof body.txHash === 'string' ? body.txHash : undefined,
    metadata: body.metadata && typeof body.metadata === 'object' ? body.metadata : undefined,
  };
  const transaction = isSupabaseConfigured
    ? await createSupabaseTransaction(input)
    : createTransaction(input);
  return NextResponse.json({ transaction }, { status: 201 });
}
