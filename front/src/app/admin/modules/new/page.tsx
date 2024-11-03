'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Course } from '@/types/course';

export default function NewModule() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    order: 1
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        if (!response.ok) throw new Error('Falha ao carregar cursos');
        const data = await response.json();
        setCourses(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, courseId: data[0].id }));
        }
      } catch (error) {
        console.error('Erro ao carregar cursos:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/modules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Falha ao criar módulo');

      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Erro ao criar módulo:', error);
      alert('Erro ao criar módulo. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <Link 
          href="/admin/dashboard"
          className="text-gray-300 hover:text-white flex items-center mb-6"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Voltar ao Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-white mb-8">Criar Novo Módulo</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="courseId" className="block text-sm font-medium text-gray-300 mb-2">
              Selecione o Curso
            </label>
            <select
              id="courseId"
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
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
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Criando...' : 'Criar Módulo'}
          </button>
        </form>
      </div>
    </div>
  );
} 