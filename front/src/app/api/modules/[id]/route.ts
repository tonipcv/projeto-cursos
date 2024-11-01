import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Primeiro, excluir todas as aulas associadas ao módulo
    await prisma.lesson.deleteMany({
      where: {
        moduleId: id,
      },
    });

    // Depois, excluir o módulo
    const deletedModule = await prisma.module.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(deletedModule);
  } catch (error) {
    console.error('Erro ao deletar módulo:', error);
    return NextResponse.json({ error: 'Erro ao deletar módulo' }, { status: 500 });
  }
} 