import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        module: {
          select: {
            title: true,
            course: {
              select: {
                title: true,
              },
            },
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    const formattedLessons = lessons ? lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description || '',
      videoUrl: lesson.embedUrl || '',
      moduleTitle: lesson.module.title,
      courseTitle: lesson.module.course.title,
    })) : [];

    return NextResponse.json(formattedLessons);
  } catch (error) {
    console.error('Erro ao buscar aulas:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Dados recebidos:', body);

    const { title, description, moduleId, videoUrl } = body;

    // Validações
    if (!moduleId) {
      console.log('moduleId não fornecido');
      return NextResponse.json({ error: 'moduleId é obrigatório' }, { status: 400 });
    }

    if (!title) {
      console.log('title não fornecido');
      return NextResponse.json({ error: 'title é obrigatório' }, { status: 400 });
    }

    // Verificar se o módulo existe
    const moduleExists = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!moduleExists) {
      console.log('Módulo não encontrado:', moduleId);
      return NextResponse.json({ error: 'Módulo não encontrado' }, { status: 404 });
    }

    // Buscar o maior order do módulo atual
    const lastLesson = await prisma.lesson.findFirst({
      where: {
        moduleId: moduleId,
      },
      orderBy: {
        order: 'desc',
      },
    });

    const newOrder = (lastLesson?.order ?? 0) + 1;
    console.log('Nova ordem:', newOrder);

    // Criar a aula
    const lessonData = {
      title,
      description: description || '',
      moduleId,
      embedUrl: videoUrl || '',
      order: newOrder,
      videoType: 'url',
      videoId: null,
      thumbnail: null,
      duration: null,
    };

    console.log('Dados para criar aula:', lessonData);

    const lesson = await prisma.lesson.create({
      data: lessonData,
      include: {
        module: {
          select: {
            title: true,
            course: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    console.log('Aula criada:', lesson);

    const response = {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      videoUrl: lesson.embedUrl,
      moduleTitle: lesson.module.title,
      courseTitle: lesson.module.course.title,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro detalhado ao criar aula:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const errorStack = error instanceof Error ? error.stack : '';
    
    console.error('Mensagem de erro:', errorMessage);
    console.error('Stack de erro:', errorStack);

    return NextResponse.json({ 
      error: 'Erro ao criar aula',
      details: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
    }, { status: 500 });
  }
} 