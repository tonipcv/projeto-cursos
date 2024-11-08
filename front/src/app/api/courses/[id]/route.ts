import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.course.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: 'Curso deletado com sucesso' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao deletar curso' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const course = await prisma.course.findUnique({
      where: {
        id: params.id,
      },
      include: {
        modules: {
          include: {
            lessons: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Erro ao buscar curso:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar curso' },
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
    const course = await prisma.course.update({
      where: {
        id: params.id,
      },
      data: {
        title: data.title,
        description: data.description,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar curso' },
      { status: 500 }
    );
  }
}
