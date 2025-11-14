#!/usr/bin/env node

// 本番環境用マイグレーションスクリプト
// 使用方法: node scripts/migrate.js

const { runMigrations } = require('../src/lib/migrate');

console.log('Starting database migration...');

runMigrations()
  .then(() => {
    console.log('Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
