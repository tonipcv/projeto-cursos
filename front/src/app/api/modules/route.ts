import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const modules = await prisma.module.findMany({
      include: {
        course: true,
        _count: {
          select: {
            lessons: true,
          },
        },
      },
    });

    return NextResponse.json(modules);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar módulos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Verifica se já existe um módulo com a mesma ordem no curso
    const existingModule = await prisma.module.findFirst({
      where: {
        courseId: data.courseId,
        order: data.order,
      },
    });

    if (existingModule) {
      // Se existir, incrementa a ordem dos módulos subsequentes
      await prisma.module.updateMany({
        where: {
          courseId: data.courseId,
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

    const module = await prisma.module.create({
      data: {
        title: data.title,
        description: data.description,
        order: data.order,
        courseId: data.courseId,
      },
    });

    return NextResponse.json(module);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar módulo' },
      { status: 500 }
    );
  }
} 