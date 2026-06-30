import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

async function getData(filename: string) {
  const filePath = path.join(process.cwd(), 'public', 'data', filename);
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

export async function GET() {
  const data = await getData('profile.json');
  return NextResponse.json(data);
}
