import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const module = await prisma.module.findUnique({
      where: {
        id: params.id,
      },
      include: {
        lessons: {
          orderBy: {
            order: 'asc',
          },
        },
        course: true,
      },
    });

    if (!module) {
      return NextResponse.json(
        { error: 'Módulo não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(module);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar módulo' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const module = await prisma.module.delete({
      where: {
        id: params.id,
      },
    });

    // Reordena os módulos restantes
    await prisma.module.updateMany({
      where: {
        courseId: module.courseId,
        order: {
          gt: module.order,
        },
      },
      data: {
        order: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json({ message: 'Módulo deletado com sucesso' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao deletar módulo' },
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
    const module = await prisma.module.update({
      where: {
        id: params.id,
      },
      data: {
        title: data.title,
        description: data.description,
        order: data.order,
      },
    });

    return NextResponse.json(module);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar módulo' },
      { status: 500 }
    );
  }
} 