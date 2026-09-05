type Row = Record<string, unknown>;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

async function request<T>(table: string, init: RequestInit = {}) {
  if (!supabaseUrl || !supabaseKey) throw new Error('Supabase is not configured');
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    ...init,
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Supabase ${response.status}: ${await response.text()}`);
  if (response.status === 204) return null as T;
  return (await response.json()) as T;
}

export async function getOrCreateSupabaseUser(externalId: string, displayName?: string) {
  const rows = await request<Row[]>('users?on_conflict=external_id', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify({ external_id: externalId, display_name: displayName ?? null }),
  });
  return rows[0];
}

export async function listSupabaseWallets(userId: number) {
  return request<Row[]>(`wallets?user_id=eq.${userId}&order=created_at.desc`);
}

export async function upsertSupabaseWallet(userId: number, provider: string, address: string, chain: string) {
  const rows = await request<Row[]>('wallets?on_conflict=user_id,address', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify({ user_id: userId, provider, address, chain }),
  });
  return rows[0];
}

export async function listSupabaseTransactions(userId: number) {
  return request<Row[]>(`transactions?user_id=eq.${userId}&order=created_at.desc,id.desc`);
}

export async function createSupabaseTransaction(input: {
  userId: number;
  walletId?: number;
  type: string;
  detail: string;
  status?: string;
  txHash?: string;
  metadata?: Record<string, unknown>;
}) {
  const rows = await request<Row[]>('transactions', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      user_id: input.userId,
      wallet_id: input.walletId ?? null,
      type: input.type,
      detail: input.detail,
      status: input.status ?? 'pending',
      tx_hash: input.txHash ?? null,
      metadata: input.metadata ?? {},
    }),
  });
  const transaction = rows[0];
  await request<Row[]>('activity', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      user_id: input.userId,
      transaction_id: transaction.id,
      type: input.type,
      detail: input.detail,
      status: input.status ?? 'pending',
    }),
  });
  return transaction;
}

export async function listSupabaseActivity(userId: number) {
  return request<Row[]>(`activity?user_id=eq.${userId}&order=created_at.desc,id.desc`);
}
