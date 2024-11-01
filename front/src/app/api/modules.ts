import { NextRequest, NextResponse } from 'next/server';
import prisma from '../lib/prisma';

export async function POST(request: NextRequest) {
  const { title, description, order, courseId } = await request.json();
  
  const newModule = await prisma.module.create({
    data: { title, description, order, courseId },
  });
  
  return NextResponse.json(newModule, { status: 201 });
}
