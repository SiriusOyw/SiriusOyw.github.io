import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

async function getData(filename: string) {
  const filePath = path.join(process.cwd(), 'public', 'data', filename);
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  let photos = await getData('photos.json');

  if (id) {
    photos = photos.filter((p: { id: string }) => p.id === id);
  }

  return NextResponse.json(photos);
}
