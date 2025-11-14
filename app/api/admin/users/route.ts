import { NextResponse } from 'next/server';
import { getAllSessions } from '@/src/lib/session';

export async function GET() {
  try {
    const users = await getAllSessions();
    return NextResponse.json({ users });
  } catch (error) {
    console.error('[admin/users] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
