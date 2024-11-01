import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Buscar total de cursos
    const totalCourses = await prisma.course.count();

    // Buscar total de módulos
    const totalModules = await prisma.module.count();

    // Buscar total de aulas
    const totalLessons = await prisma.lesson.count();

    const stats = {
      totalCourses,
      totalModules,
      totalLessons
    };

    console.log('Estatísticas:', stats); // Debug

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json({
      totalCourses: 0,
      totalModules: 0,
      totalLessons: 0
    });
  }
} 