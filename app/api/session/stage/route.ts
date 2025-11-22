import { NextRequest, NextResponse } from 'next/server';
import { updateSessionStage, getSession } from '@/lib/session';
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
    const updated = await getSession(sessionId);
    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error('[session/stage] Error:', error);
    return NextResponse.json({ error: 'Failed to update stage' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[API POST /session/stage] Request received');
    const body = await request.json();
    
    const cookieStore = await cookies();
    const cookieSessionId = cookieStore.get('sessionId')?.value;
    const bodySessionId = body.sessionId;
    const sessionId = bodySessionId || cookieSessionId;
    
    console.log('[API POST /session/stage] SessionId from cookie:', cookieSessionId);
    console.log('[API POST /session/stage] SessionId from body:', bodySessionId);
    console.log('[API POST /session/stage] Using sessionId:', sessionId);

    if (!sessionId) {
      console.log('[API POST /session/stage] No sessionId found');
      return NextResponse.json({ error: 'sessionId not found in cookies or body' }, { status: 401 });
    }

    const stage = body.stage;
    console.log('[API POST /session/stage] Requested stage:', stage, 'Type:', typeof stage);

    if (typeof stage !== 'number') {
      console.log('[API POST /session/stage] Stage is not a number');
      return NextResponse.json({ error: 'stage must be a number' }, { status: 400 });
    }

    console.log('[API POST /session/stage] Calling updateSessionStage');
    await updateSessionStage(sessionId, stage);
    console.log('[API POST /session/stage] Getting updated user');
    const updated = await getSession(sessionId);
    console.log('[API POST /session/stage] Success, returning user:', updated);
    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error('[session/stage POST] Error:', error);
    return NextResponse.json({ error: 'Failed to update stage', details: String(error) }, { status: 500 });
  }
}
