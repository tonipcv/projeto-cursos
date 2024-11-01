import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        modules: {
          include: {
            lessons: true
          }
        }
      },
      orderBy: {
        title: 'asc',
      },
    });

    const formattedCourses = courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      modules: course.modules,
      totalModules: course.modules.length,
      totalLessons: course.modules.reduce((acc, module) => 
        acc + (module.lessons?.length || 0), 0),
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    }));

    return NextResponse.json(formattedCourses);
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    return NextResponse.json({ error: 'Erro ao buscar cursos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return NextResponse.json({ 
        error: 'Título e descrição são obrigatórios' 
      }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
      },
      include: {
        modules: true
      }
    });

    return NextResponse.json({
      id: course.id,
      title: course.title,
      description: course.description,
      modules: course.modules,
      totalModules: 0,
      totalLessons: 0,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    });
  } catch (error) {
    console.error('Erro ao criar curso:', error);
    return NextResponse.json({ error: 'Erro ao criar curso' }, { status: 500 });
  }
} 