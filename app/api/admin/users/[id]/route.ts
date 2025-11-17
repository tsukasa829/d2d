import { NextRequest, NextResponse } from 'next/server';
import { 
  getSessionById, 
  updateSessionEmail, 
  updateSession1DayPass, 
  updateSessionStandard,
  updateSessionTrial,
  updateSessionStage,
  deleteSession 
} from '@/lib/session';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getSessionById(id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    console.error('[admin/users/[id]] GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    if (body.email !== undefined) {
      await updateSessionEmail(id, body.email);
    }
    if (body.trial !== undefined) {
      await updateSessionTrial(id, body.trial);
    }
    if (body.stage !== undefined) {
      await updateSessionStage(id, body.stage);
    }
    if (body.has1DayPass !== undefined) {
      await updateSession1DayPass(id, body.has1DayPass);
    }
    if (body.hasStandard !== undefined) {
      await updateSessionStandard(id, body.hasStandard);
    }

    const updated = await getSessionById(id);
    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error('[admin/users/[id]] PATCH Error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteSession(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[admin/users/[id]] DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
