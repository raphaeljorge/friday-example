import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface LibraryDB extends DBSchema {
  userPreferences: {
    key: string;
    value: any;
  };
  readingHistory: {
    key: string;
    value: any;
  };
}

class IndexedDBManager {
  private static instance: IndexedDBManager;
  private db: IDBPDatabase<LibraryDB> | null = null;
  private readonly DB_NAME = 'library-db';
  private readonly VERSION = 1;

  private constructor() {}

  static getInstance(): IndexedDBManager {
    if (!IndexedDBManager.instance) {
      IndexedDBManager.instance = new IndexedDBManager();
    }
    return IndexedDBManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.db) return;

    this.db = await openDB<LibraryDB>(this.DB_NAME, this.VERSION, {
      upgrade(db) {
        db.createObjectStore('userPreferences', { keyPath: 'key' });
        db.createObjectStore('readingHistory', { keyPath: 'key' });
      },
    });
  }

  async setUserPreference(key: string, value: any): Promise<void> {
    await this.initialize();
    if (this.db) {
      await this.db.put('userPreferences', { key, value });
    }
  }

  async getUserPreference(key: string): Promise<any> {
    await this.initialize();
    if (this.db) {
      const preference = await this.db.get('userPreferences', key);
      return preference ? preference.value : null;
    }
    return null;
  }

  async setReadingHistory(key: string, value: any): Promise<void> {
    await this.initialize();
    if (this.db) {
      await this.db.put('readingHistory', { key, value });
    }
  }

  async getReadingHistory(key: string): Promise<any> {
    await this.initialize();
    if (this.db) {
      const history = await this.db.get('readingHistory', key);
      return history ? history.value : null;
    }
    return null;
  }
}

export const dbManager = IndexedDBManager.getInstance();