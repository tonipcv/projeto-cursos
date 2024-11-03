import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: {
        id: params.id,
      },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Aula não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(lesson);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar aula' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Primeiro, obtém a aula atual para saber sua ordem e módulo
    const currentLesson = await prisma.lesson.findUnique({
      where: { id: params.id }
    });

    if (!currentLesson) {
      return NextResponse.json(
        { error: 'Aula não encontrada' },
        { status: 404 }
      );
    }

    // Deleta a aula
    await prisma.lesson.delete({
      where: {
        id: params.id,
      },
    });

    // Reordena as aulas restantes
    await prisma.lesson.updateMany({
      where: {
        moduleId: currentLesson.moduleId,
        order: {
          gt: currentLesson.order,
        },
      },
      data: {
        order: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json({ message: 'Aula deletada com sucesso' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao deletar aula' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    // Se a ordem foi alterada, reordena as outras aulas
    const currentLesson = await prisma.lesson.findUnique({
      where: { id: params.id }
    });

    if (currentLesson && data.order !== currentLesson.order) {
      await prisma.lesson.updateMany({
        where: {
          moduleId: currentLesson.moduleId,
          order: {
            gte: data.order,
          },
          id: {
            not: params.id
          }
        },
        data: {
          order: {
            increment: 1,
          },
        },
      });
    }

    const lesson = await prisma.lesson.update({
      where: {
        id: params.id,
      },
      data: {
        title: data.title,
        description: data.description,
        videoId: data.videoId,
        embedUrl: data.embedUrl,
        videoType: data.videoType,
        thumbnail: data.thumbnail,
        duration: data.duration,
        order: data.order,
        moduleId: data.moduleId, // Permite mudar o módulo da aula
      },
      include: {
        module: {
          include: {
            course: true
          }
        }
      }
    });

    return NextResponse.json(lesson);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar aula' },
      { status: 500 }
    );
  }
} 