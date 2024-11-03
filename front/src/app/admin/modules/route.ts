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