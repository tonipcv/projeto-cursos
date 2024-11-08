'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { api } from '@/lib/api';
import type { Course } from '@/types/course';

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        console.log('Iniciando carregamento...');
        const data = await api.courses.list();
        console.log('Dados carregados:', data);
        setCourses(data);
      } catch (error) {
        console.error('Erro:', error);
        setError('Falha ao carregar cursos');
      } finally {
        setIsLoading(false);
      }
    }

    loadCourses();
  }, []);

  console.log('Estado:', { isLoading, coursesLength: courses.length, error });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Cursos ({courses.length})</h1>
          <Link
            href="/courses/new"
            className="bg-primary px-4 py-2 rounded-lg text-white flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Novo Curso
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="bg-dark-card p-6 rounded-lg hover:ring-1 hover:ring-primary transition-all"
            >
              <h2 className="text-xl font-semibold text-white mb-2">{course.title}</h2>
              <p className="text-gray-400 text-sm">{course.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
