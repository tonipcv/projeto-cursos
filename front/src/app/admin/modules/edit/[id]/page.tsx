'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Course } from '@/types/course';

export default function EditModule() {
  const router = useRouter();
  const params = useParams();
  const moduleId = params?.id as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    order: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar módulo
        const moduleResponse = await fetch(`/api/modules/${moduleId}`);
        if (!moduleResponse.ok) throw new Error('Falha ao carregar módulo');
        const moduleData = await moduleResponse.json();

        // Buscar cursos
        const coursesResponse = await fetch('/api/courses');
        if (!coursesResponse.ok) throw new Error('Falha ao carregar cursos');
        const coursesData = await coursesResponse.json();

        setCourses(coursesData);
        setFormData({
          title: moduleData.title,
          description: moduleData.description,
          courseId: moduleData.courseId,
          order: moduleData.order
        });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar dados. Tente novamente.');
      }
    };

    if (moduleId) {
      fetchData();
    }
  }, [moduleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/modules/${moduleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Falha ao atualizar módulo');

      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Erro ao atualizar módulo:', error);
      alert('Erro ao atualizar módulo. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-2xl mx-auto">
        <Link 
          href="/admin/dashboard"
          className="text-gray-300 hover:text-white flex items-center mb-6"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Voltar ao Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-white mb-8">Editar Módulo</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="courseId" className="block text-sm font-medium text-gray-300 mb-2">
              Curso
            </label>
            <select
              id="courseId"
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            >
              <option value="">Selecione um curso</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Título do Módulo
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>

          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-300 mb-2">
              Ordem
            </label>
            <input
              type="number"
              id="order"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              min="0"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 py-3 px-4 bg-violet-600/20 text-violet-500 rounded-lg hover:bg-violet-600/30 transition-all border border-violet-500/20 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            
            <Link
              href="/admin/dashboard"
              className="flex-1 py-3 px-4 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors text-center"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 