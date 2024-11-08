'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Course } from '@/types';
import { ConfirmationModal } from '@/components/ConfirmationModal';

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [secondConfirmation, setSecondConfirmation] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

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

  const handleDeleteClick = (course: Course, e: React.MouseEvent) => {
    e.preventDefault();
    setCourseToDelete(course);
    setDeleteModalOpen(true);
    setSecondConfirmation(false);
  };

  const handleDeleteConfirm = async () => {
    if (!secondConfirmation) {
      setSecondConfirmation(true);
      return;
    }

    if (courseToDelete) {
      try {
        await api.courses.delete(courseToDelete.id);
        await fetchCourses();
        setDeleteModalOpen(false);
        setCourseToDelete(null);
        setSecondConfirmation(false);
      } catch (error) {
        console.error('Erro ao deletar curso:', error);
        alert('Erro ao deletar curso');
      }
    }
  };

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
              <div
                key={course.id}
                className="glass-effect rounded-xl p-6 border border-primary/10 hover:border-primary/30 transition-all group relative"
              >
                {/* Botões de ação */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Link
                    href={`/courses/edit/${course.id}`}
                    className="p-2 text-gray-400 hover:text-primary transition-colors rounded-full hover:bg-primary/10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={(e) => handleDeleteClick(course, e)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-full hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Conteúdo do card */}
                <Link href={`/courses/${course.id}`}>
                  <h2 className="text-xl font-semibold text-primary-light group-hover:text-primary transition-colors mt-4">
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
              </div>
            ))
          )}
        </div>
      </main>
      {deleteModalOpen && courseToDelete && (
        <ConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setCourseToDelete(null);
            setSecondConfirmation(false);
          }}
          onConfirm={handleDeleteConfirm}
          title={secondConfirmation ? "Confirmação Final" : "Confirmar Exclusão"}
          message={
            secondConfirmation
              ? `Tem certeza absoluta que deseja excluir o curso "${courseToDelete.title}"? Esta ação não pode ser desfeita.`
              : `Você está prestes a excluir o curso "${courseToDelete.title}". Deseja continuar?`
          }
        />
      )}
    </div>
  );
}
