import { NextResponse } from 'next/server';
import { runMigrations } from '@/lib/migrate';
import * as db from '@/lib/db';

export async function POST() {
  try {
    // 繝槭う繧ｰ繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ螳溯｡・
    await runMigrations();

    // 繝・Δ繝ｦ繝ｼ繧ｶ繝ｼ縺ｮ蜿門ｾ励∪縺溘・菴懈・
    const demoEmail = 'demo@example.com';
    let user = await db.getUserByEmail(demoEmail);

    if (!user) {
      user = await db.createUser(demoEmail, '繝・Δ繝ｦ繝ｼ繧ｶ繝ｼ');
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
