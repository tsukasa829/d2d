import { PGlite } from '@electric-sql/pglite';
import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import * as path from 'path';
import * as fs from 'fs';

export interface DBClient {
  query<T extends QueryResultRow = any>(sql: string, params?: any[]): Promise<QueryResult<T>>;
  close(): Promise<void>;
}

class PGliteClient implements DBClient {
  private db: PGlite | null = null;
  private initPromise: Promise<void> | null = null;

  private async init() {
    if (this.db) return;

    const dataDir = process.env.PGLITE_DATA_DIR || './data/pglite';
    
    // ディレクトリが存在しない場合は作成
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    this.db = new PGlite(dataDir);
    await this.db.waitReady;
  }

  async query<T extends QueryResultRow = any>(sql: string, params: any[] = []): Promise<QueryResult<T>> {
    if (!this.initPromise) {
      this.initPromise = this.init();
    }
    await this.initPromise;

    if (!this.db) {
      throw new Error('PGlite database not initialized');
    }

    const result = await this.db.query(sql, params);
    return result as QueryResult<T>;
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
      this.initPromise = null;
    }
  }
}

class PostgreSQLClient implements DBClient {
  private pool: Pool;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is required for production');
    }

    this.pool = new Pool({
      connectionString: databaseUrl,
      // データベースのタイムゾーンをUTCに設定
      options: '-c timezone=UTC',
    });
  }

  async query<T extends QueryResultRow = any>(sql: string, params: any[] = []): Promise<QueryResult<T>> {
    return this.pool.query<T>(sql, params);
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

// Next.jsのホットリロードに対応するため、globalオブジェクトを使用
const globalForDB = globalThis as unknown as {
  dbClient: DBClient | undefined;
};

export function getDBClient(): DBClient {
  if (!globalForDB.dbClient) {
    const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.DATABASE_URL;
    
    if (isDevelopment) {
      console.log('Using PGlite for development');
      globalForDB.dbClient = new PGliteClient();
    } else {
      console.log('Using PostgreSQL for production');
      globalForDB.dbClient = new PostgreSQLClient();
    }
  }

  return globalForDB.dbClient;
}

export async function closeDBClient(): Promise<void> {
  if (globalForDB.dbClient) {
    await globalForDB.dbClient.close();
    globalForDB.dbClient = undefined;
  }
}
