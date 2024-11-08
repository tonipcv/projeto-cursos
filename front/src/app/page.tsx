'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { api } from '@/lib/api';

interface Course {
  id: string;
  title: string;
  description: string;
}

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await api.courses.list();
        setCourses(data);
      } catch (error) {
        console.error('Erro ao carregar cursos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark to-dark-lighter">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark to-dark-lighter">
      <main className="container mx-auto px-4 py-16">
        {/* Header simples */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold text-white">
            Meus Cursos
          </h1>
          <Link
            href="/courses/new"
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark px-4 py-2 rounded-lg text-white transition-colors"
          >
            <Plus className="h-5 w-5" />
            Novo Curso
          </Link>
        </div>

        {/* Grid de Cursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 mb-4">Nenhum curso criado ainda</p>
              <Link
                href="/courses/new"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-light"
              >
                <Plus className="h-5 w-5" />
                Criar primeiro curso
              </Link>
            </div>
          ) : (
            courses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="glass-effect rounded-xl p-6 border border-primary/10 hover:border-primary/30 transition-all group"
              >
                <h2 className="text-xl font-semibold text-primary-light group-hover:text-primary transition-colors">
                  {course.title}
                </h2>
                <p className="mt-2 text-gray-400 text-sm line-clamp-2">
                  {course.description}
                </p>
                <div className="mt-4 flex justify-end">
                  <span className="text-sm text-primary group-hover:text-primary-light transition-colors">
                    Ver detalhes →
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
