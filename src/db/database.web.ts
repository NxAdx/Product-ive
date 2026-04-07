import type { PersistedDatabase, PersistedTransaction } from './types';

const noopTransaction: PersistedTransaction = {
  runAsync: async () => undefined,
};

const noopDatabase: PersistedDatabase = {
  runAsync: async () => undefined,
  execAsync: async () => undefined,
  getFirstAsync: async () => null,
  withExclusiveTransactionAsync: async <T>(task: (tx: PersistedTransaction) => Promise<T>) =>
    task(noopTransaction),
};

export async function getDatabase(): Promise<PersistedDatabase> {
  return noopDatabase;
}

export async function initializeDatabase(): Promise<void> {
  return;
}
