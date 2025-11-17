import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createSession } from '@/lib/session';
import { runMigrations } from '@/lib/migrate';

export async function POST(request: NextRequest) {
  try {
    // 初回アクセス時にマイグレーション実衁E
    await runMigrations();
    
    const sessionId = randomUUID();
    const user = await createSession(sessionId);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('[session/init] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
