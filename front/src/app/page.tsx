'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, MoreVertical } from 'lucide-react';
import { api } from '@/lib/api';
import type { Course } from '@/types/course';

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const data = await api.courses.list();
      setCourses(data);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
      setError('Erro ao carregar cursos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDeleteCourse = async (courseId: number) => {
    try {
      await api.courses.delete(courseId);
      await fetchCourses(); // Recarrega a lista após deletar
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Erro ao deletar curso:', error);
      alert('Erro ao deletar curso');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark to-dark-lighter flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark to-dark-lighter">
      <main className="container mx-auto px-4 py-8">
        {/* Header com Título e Botão de Novo Curso */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Meus Cursos</h1>
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
              <div key={course.id} className="group relative">
                <div className="glass-effect rounded-xl p-6 border border-primary/10 hover:border-primary/30 transition-all">
                  {/* Thumbnail do Curso */}
                  {course.thumbnailUrl && (
                    <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}

                  {/* Informações do Curso */}
                  <Link href={`/courses/${course.id}`}>
                    <h2 className="text-xl font-semibold text-primary-light group-hover:text-primary transition-colors">
                      {course.title}
                    </h2>
                    <p className="mt-2 text-gray-400 text-sm line-clamp-2">
                      {course.description}
                    </p>
                  </Link>

                  {/* Estatísticas do Curso */}
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>{course.modules.length} módulos</span>
                      <span>
                        {course.modules.reduce((acc, module) => acc + module.lessons.length, 0)} aulas
                      </span>
                    </div>
                  </div>

                  {/* Ações do Curso */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/courses/edit/${course.id}`}
                      className="p-2 bg-dark-lighter rounded-full hover:bg-primary/20 transition-colors"
                    >
                      <Edit className="h-4 w-4 text-primary" />
                    </Link>
                    <button
                      onClick={() => setShowDeleteConfirm(course.id)}
                      className="p-2 bg-dark-lighter rounded-full hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                </div>

                {/* Modal de Confirmação de Exclusão */}
                {showDeleteConfirm === course.id && (
                  <div className="fixed inset-0 bg-dark/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="glass-effect rounded-lg p-6 max-w-md border border-primary/20">
                      <h3 className="text-xl font-bold text-white mb-4">Confirmar Exclusão</h3>
                      <p className="text-gray-300 mb-6">
                        Tem certeza que deseja excluir o curso "{course.title}"? Esta ação não pode ser desfeita.
                      </p>
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
