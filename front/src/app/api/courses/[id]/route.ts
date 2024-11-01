import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Primeiro, excluir todas as aulas dos módulos do curso
    await prisma.lesson.deleteMany({
      where: {
        module: {
          courseId: id,
        },
      },
    });

    // Depois, excluir os módulos do curso
    await prisma.module.deleteMany({
      where: {
        courseId: id,
      },
    });

    // Por fim, excluir o curso
    const deletedCourse = await prisma.course.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.error('Erro ao deletar curso:', error);
    return NextResponse.json({ error: 'Erro ao deletar curso' }, { status: 500 });
  }
} 