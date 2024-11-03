import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        _count: {
          select: {
            modules: true
          }
        },
        modules: {
          include: {
            _count: {
              select: {
                lessons: true
              }
            }
          }
        }
      }
    });

    // Transformar os dados para incluir as contagens
    const formattedCourses = courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      modulesCount: course._count.modules,
      lessonsCount: course.modules.reduce((acc, module) => acc + module._count.lessons, 0),
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    }));

    return NextResponse.json(formattedCourses);
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
      include: {
        _count: {
          select: {
            modules: true
          }
        }
      }
    });

    return NextResponse.json({
      ...course,
      modulesCount: course._count.modules,
      lessonsCount: 0
    });
  } catch (error) {
    console.error('Erro ao criar curso:', error);
    return NextResponse.json(
      { error: 'Erro ao criar curso' },
      { status: 500 }
    );
  }
} 