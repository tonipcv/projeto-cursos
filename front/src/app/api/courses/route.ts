import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar cursos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const course = await prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('Erro ao criar curso:', error);
    return NextResponse.json(
      { error: 'Erro ao criar curso' },
      { status: 500 }
    );
  }
} 