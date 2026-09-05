import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

type Row = Record<string, unknown>;

const dataDirectory = path.join(process.cwd(), '.data');
const databasePath = path.join(dataDirectory, 'orbitai.sqlite');

declare global {
  // eslint-disable-next-line no-var
  var orbitDatabase: DatabaseSync | undefined;
}

function createDatabase() {
  fs.mkdirSync(dataDirectory, { recursive: true });
  const database = new DatabaseSync(databasePath);
  database.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      external_id TEXT NOT NULL UNIQUE,
      display_name TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS wallets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      provider TEXT NOT NULL,
      address TEXT NOT NULL,
      chain TEXT NOT NULL DEFAULT 'multi-chain',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, address),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      wallet_id INTEGER,
      type TEXT NOT NULL,
      detail TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      tx_hash TEXT,
      metadata TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(wallet_id) REFERENCES wallets(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS activity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      transaction_id INTEGER,
      type TEXT NOT NULL,
      detail TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(transaction_id) REFERENCES transactions(id) ON DELETE SET NULL
    );
  `);
  return database;
}

export function getDatabase() {
  if (!globalThis.orbitDatabase) globalThis.orbitDatabase = createDatabase();
  return globalThis.orbitDatabase;
}

export function getOrCreateUser(externalId: string, displayName?: string) {
  const database = getDatabase();
  database.prepare(`
    INSERT INTO users (external_id, display_name) VALUES (?, ?)
    ON CONFLICT(external_id) DO UPDATE SET
      display_name = COALESCE(excluded.display_name, users.display_name),
      updated_at = CURRENT_TIMESTAMP
  `).run(externalId, displayName ?? null);
  return database.prepare('SELECT * FROM users WHERE external_id = ?').get(externalId) as Row;
}

export function listWallets(userId: number) {
  return getDatabase().prepare('SELECT * FROM wallets WHERE user_id = ? ORDER BY created_at DESC').all(userId);
}

export function upsertWallet(userId: number, provider: string, address: string, chain: string) {
  const database = getDatabase();
  database.prepare(`
    INSERT INTO wallets (user_id, provider, address, chain) VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id, address) DO UPDATE SET provider = excluded.provider, chain = excluded.chain
  `).run(userId, provider, address, chain);
  return database.prepare('SELECT * FROM wallets WHERE user_id = ? AND address = ?').get(userId, address) as Row;
}

export function listTransactions(userId: number) {
  return getDatabase().prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC, id DESC').all(userId);
}

export function createTransaction(input: {
  userId: number;
  walletId?: number;
  type: string;
  detail: string;
  status?: string;
  txHash?: string;
  metadata?: Record<string, unknown>;
}) {
  const database = getDatabase();
  const result = database.prepare(`
    INSERT INTO transactions (user_id, wallet_id, type, detail, status, tx_hash, metadata)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.userId,
    input.walletId ?? null,
    input.type,
    input.detail,
    input.status ?? 'pending',
    input.txHash ?? null,
    JSON.stringify(input.metadata ?? {}),
  );
  const id = Number(result.lastInsertRowid);
  database.prepare(`
    INSERT INTO activity (user_id, transaction_id, type, detail, status)
    VALUES (?, ?, ?, ?, ?)
  `).run(input.userId, id, input.type, input.detail, input.status ?? 'pending');
  return database.prepare('SELECT * FROM transactions WHERE id = ?').get(id) as Row;
}

export function listActivity(userId: number) {
  return getDatabase().prepare(`
    SELECT id, transaction_id, type, detail, status, created_at
    FROM activity WHERE user_id = ? ORDER BY created_at DESC, id DESC
  `).all(userId);
}
