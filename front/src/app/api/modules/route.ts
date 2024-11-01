import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const modules = await prisma.module.findMany({
      include: {
        course: true
      },
      orderBy: [
        {
          course: {
            title: 'asc',
          },
        },
        {
          order: 'asc',
        },
      ],
    });

    const formattedModules = modules.map(module => ({
      id: module.id,
      title: module.title,
      description: module.description,
      courseId: module.courseId,
      courseTitle: module.course.title,
      course: module.course
    }));

    return NextResponse.json(formattedModules);
  } catch (error) {
    console.error('Erro ao buscar módulos:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, courseId } = body;

    // Buscar o maior order do curso atual
    const lastModule = await prisma.module.findFirst({
      where: {
        courseId: courseId,
      },
      orderBy: {
        order: 'desc',
      },
    });

    const newOrder = (lastModule?.order ?? 0) + 1;

    const module = await prisma.module.create({
      data: {
        title,
        description,
        courseId,
        order: newOrder,
      },
      include: {
        course: true
      },
    });

    return NextResponse.json({
      id: module.id,
      title: module.title,
      description: module.description,
      courseId: module.courseId,
      courseTitle: module.course.title,
      course: module.course
    });
  } catch (error) {
    console.error('Erro ao criar módulo:', error);
    return NextResponse.json({ error: 'Erro ao criar módulo' }, { status: 500 });
  }
} 