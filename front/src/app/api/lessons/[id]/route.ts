import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const deletedLesson = await prisma.lesson.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(deletedLesson);
  } catch (error) {
    console.error('Erro ao deletar aula:', error);
    return NextResponse.json({ error: 'Erro ao deletar aula' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 