import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Buscar totais
    const totalCourses = await prisma.course.count();
    const totalModules = await prisma.module.count();
    const totalLessons = await prisma.lesson.count();

    // Calcular médias
    const averageLessonsPerModule = totalModules > 0 ? totalLessons / totalModules : 0;
    const averageModulesPerCourse = totalCourses > 0 ? totalModules / totalCourses : 0;

    // Buscar cursos com contagem de módulos
    const coursesWithModules = await prisma.course.findMany({
      include: {
        _count: {
          select: { modules: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10 // Limitar aos 10 últimos cursos
    });

    // Agrupar cursos por mês
    const coursesPerMonth = await prisma.course.groupBy({
      by: ['createdAt'],
      _count: {
        id: true
      },
      orderBy: {
        createdAt: 'asc'
      },
      take: 12 // Últimos 12 meses
    });

    // Formatar dados para os gráficos
    const modulesPerCourse = coursesWithModules.map(course => ({
      courseName: course.title,
      moduleCount: course._count.modules
    }));

    const monthNames = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];

    const formattedCoursesPerMonth = coursesPerMonth.map(item => ({
      month: monthNames[new Date(item.createdAt).getMonth()],
      count: item._count.id
    }));

    return NextResponse.json({
      totalCourses,
      totalModules,
      totalLessons,
      averageLessonsPerModule,
      averageModulesPerCourse,
      modulesPerCourse,
      coursesPerMonth: formattedCoursesPerMonth
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    );
  }
} 