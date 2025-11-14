import { getDBClient, closeDBClient } from './dbClient';
import * as fs from 'fs';
import * as path from 'path';

interface Migration {
  version: string;
  filename: string;
  sql: string;
}

async function getMigrations(): Promise<Migration[]> {
  const migrationsDir = path.join(process.cwd(), 'src', 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    throw new Error(`Migrations directory not found: ${migrationsDir}`);
  }

  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();

  return files.map(filename => {
    const filePath = path.join(migrationsDir, filename);
    const sql = fs.readFileSync(filePath, 'utf-8');
    const version = filename.replace('.sql', '');
    
    return { version, filename, sql };
  });
}

async function getExecutedMigrations(): Promise<Set<string>> {
  const client = getDBClient();
  
  try {
    const result = await client.query<{ version: string }>(
      'SELECT version FROM schema_migrations'
    );
    return new Set(result.rows.map(row => row.version));
  } catch (error) {
    // schema_migrationsテーブルが存在しない場合は空のSetを返す
    return new Set();
  }
}

async function executeMigration(migration: Migration): Promise<void> {
  const client = getDBClient();
  
  console.log(`Executing migration: ${migration.filename}`);
  
  try {
    // コメント行を除去してからSQLを';'で分割して個別に実行
    const cleanedSql = migration.sql
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');
    
    const statements = cleanedSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    for (const statement of statements) {
      await client.query(statement);
    }
    
    // schema_migrationsテーブルに記録（ON CONFLICT対応）
    await client.query(
      'INSERT INTO schema_migrations (version) VALUES ($1) ON CONFLICT (version) DO NOTHING',
      [migration.version]
    );
    
    console.log(`✓ Migration completed: ${migration.filename}`);
  } catch (error) {
    console.error(`✗ Migration failed: ${migration.filename}`);
    throw error;
  }
}

// グローバルロックでマイグレーションの並行実行を防ぐ
let migrationPromise: Promise<void> | null = null;

export async function runMigrations(): Promise<void> {
  // 既に実行中の場合は同じPromiseを返す
  if (migrationPromise) {
    return migrationPromise;
  }

  migrationPromise = (async () => {
    console.log('Starting database migrations...');
    
    try {
      const migrations = await getMigrations();
      const executedMigrations = await getExecutedMigrations();
      
      const pendingMigrations = migrations.filter(
        migration => !executedMigrations.has(migration.version)
      );
      
      if (pendingMigrations.length === 0) {
        console.log('No pending migrations. Database is up to date.');
        return;
      }
      
      console.log(`Found ${pendingMigrations.length} pending migration(s)`);
      
      for (const migration of pendingMigrations) {
        await executeMigration(migration);
      }
      
      console.log('All migrations completed successfully!');
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    } finally {
      migrationPromise = null;
    }
  })();

  return migrationPromise;
}

// スクリプトとして直接実行された場合
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Migration script finished.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
}
