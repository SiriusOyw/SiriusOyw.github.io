import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'public', 'resume.pdf');

  try {
    const fileBuffer = await fs.readFile(filePath);
    const fileName = 'OuyangWen_Resume.pdf';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'no-cache',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Resume file not found' },
      { status: 404 }
    );
  }
}
