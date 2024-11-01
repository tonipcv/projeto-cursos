'use client';

import React, { useState, useEffect } from 'react';
import { Layout } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  totalModules: number;
  totalLessons: number;
}

interface AddModuleFormProps {
  onModuleAdded: () => void;
}

export default function AddModuleForm({ onModuleAdded }: AddModuleFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/courses');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Cursos recebidos:', data);

      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        throw new Error('Formato de dados inválido');
      }
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
      setError('Erro ao carregar cursos');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/modules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          courseId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao adicionar módulo');
      }

      setTitle('');
      setDescription('');
      setCourseId('');
      onModuleAdded();
    } catch (error) {
      console.error('Erro ao adicionar módulo:', error);
      setError(error instanceof Error ? error.message : 'Erro ao adicionar módulo');
    } finally {
      setLoading(false);
    }
  };

  const selectedCourse = courses.find(course => course.id === courseId);

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Layout className="h-6 w-6 text-indigo-500" />
        Adicionar Módulo
      </h2>
      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="course" className="block text-sm font-medium text-gray-400 mb-1">
            Curso
          </label>
          <select
            id="course"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 px-3"
            required
            disabled={loading}
          >
            <option value="">Selecione um curso</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title} ({course.totalModules} módulos)
              </option>
            ))}
          </select>
          {selectedCourse && (
            <p className="mt-2 text-sm text-gray-400">
              {selectedCourse.description}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">
            Título
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 px-3"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">
            Descrição
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
            required
            disabled={loading}
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full inline-flex justify-center rounded-md border border-transparent ${
              loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
            } py-3 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
          >
            {loading ? 'Adicionando...' : 'Adicionar Módulo'}
          </button>
        </div>
      </form>
    </div>
  );
} 