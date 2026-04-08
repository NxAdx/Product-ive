export interface PersistedTransaction {
  runAsync: (sql: string, ...params: unknown[]) => Promise<unknown>;
}

export interface PersistedDatabase {
  runAsync: (sql: string, ...params: unknown[]) => Promise<unknown>;
  execAsync: (sql: string) => Promise<void>;
  getFirstAsync: <T>(sql: string, ...params: unknown[]) => Promise<T | null>;
  getAllAsync: <T>(sql: string, ...params: unknown[]) => Promise<T[]>;
  withExclusiveTransactionAsync: <T>(
    task: (tx: PersistedTransaction) => Promise<T>
  ) => Promise<T>;
}
