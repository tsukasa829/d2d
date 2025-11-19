import { NextRequest, NextResponse } from 'next/server';
import { updateSessionStage, getSessionById } from '@/lib/session';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId') || url.searchParams.get('userId');
    const stageParam = url.searchParams.get('stage') || url.searchParams.get('value');

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }
    if (stageParam == null) {
      return NextResponse.json({ error: 'stage (or value) is required' }, { status: 400 });
    }

    const stage = Number(stageParam);
    if (Number.isNaN(stage)) {
      return NextResponse.json({ error: 'stage must be a number' }, { status: 400 });
    }

    await updateSessionStage(sessionId, stage);
    const updated = await getSessionById(sessionId);
    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error('[session/stage] Error:', error);
    return NextResponse.json({ error: 'Failed to update stage' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sessionId')?.value;

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId not found in cookies' }, { status: 401 });
    }

    const body = await request.json();
    const stage = body.stage;

    if (typeof stage !== 'number') {
      return NextResponse.json({ error: 'stage must be a number' }, { status: 400 });
    }

    await updateSessionStage(sessionId, stage);
    const updated = await getSessionById(sessionId);
    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error('[session/stage POST] Error:', error);
    return NextResponse.json({ error: 'Failed to update stage' }, { status: 500 });
  }
}
