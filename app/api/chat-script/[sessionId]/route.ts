import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const file = path.join(process.cwd(), 'docs', 'chats', `${sessionId}.md`);
    const data = await fs.readFile(file, 'utf8');
    return new NextResponse(data, { status: 200, headers: { 'content-type': 'text/markdown; charset=utf-8' } });
  } catch (e) {
    return NextResponse.json({ error: 'script_not_found' }, { status: 404 });
  }
}
