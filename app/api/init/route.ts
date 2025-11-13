import { NextResponse } from 'next/server';
import { runMigrations } from '@/src/lib/migrate';
import * as db from '@/src/lib/db';

export async function POST() {
  try {
    // マイグレーション実行
    await runMigrations();

    // デモユーザーの取得または作成
    const demoEmail = 'demo@example.com';
    let user = await db.getUserByEmail(demoEmail);

    if (!user) {
      user = await db.createUser(demoEmail, 'デモユーザー');
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Initialization error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
