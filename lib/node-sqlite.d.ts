declare module 'node:sqlite' {
  export class DatabaseSync {
    constructor(filename: string);
    exec(sql: string): void;
    prepare(sql: string): {
      run(...params: unknown[]): { lastInsertRowid: number | bigint; changes: number | bigint };
      get(...params: unknown[]): Record<string, unknown> | undefined;
      all(...params: unknown[]): Record<string, unknown>[];
    };
    close(): void;
  }
}
