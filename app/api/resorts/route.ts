import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Resort from '@/lib/models/Resort';

export async function GET(req: Request) {
  try {
    await connectDB();
    const resorts = await Resort.find({}).sort({ createdAt: -1 });
    return NextResponse.json(resorts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch resorts' }, { status: 500 });
  }
}