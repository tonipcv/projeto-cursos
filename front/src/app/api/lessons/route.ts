import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar aulas' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Verifica se já existe uma aula com a mesma ordem no módulo
    const existingLesson = await prisma.lesson.findFirst({
      where: {
        moduleId: data.moduleId,
        order: data.order,
      },
    });

    if (existingLesson) {
      // Se existir, incrementa a ordem das aulas subsequentes
      await prisma.lesson.updateMany({
        where: {
          moduleId: data.moduleId,
          order: {
            gte: data.order,
          },
        },
        data: {
          order: {
            increment: 1,
          },
        },
      });
    }

    const lesson = await prisma.lesson.create({
      data: {
        title: data.title,
        description: data.description,
        videoId: data.videoId,
        embedUrl: data.embedUrl,
        videoType: data.videoType,
        thumbnail: data.thumbnail,
        duration: data.duration,
        order: data.order,
        moduleId: data.moduleId,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Erro ao criar aula:', error);
    return NextResponse.json(
      { error: 'Erro ao criar aula' },
      { status: 500 }
    );
  }
} 