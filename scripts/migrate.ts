#!/usr/bin/env tsx

// 本番環境用マイグレーションスクリプト
// 使用方法: npm run migrate:prod

import { runMigrations, closeDBClient } from '../src/lib/migrate';

console.log('Starting database migration...');

runMigrations()
  .then(() => {
    console.log('Migration completed successfully!');
    return closeDBClient();
  })
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
