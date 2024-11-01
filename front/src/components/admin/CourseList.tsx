'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Trash2 } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  modules: any[];
  totalModules: number;
  totalLessons: number;
  createdAt: string;
  updatedAt: string;
}

interface CourseListProps {
  onUpdate: () => void;
}

export default function CourseList({ onUpdate }: CourseListProps) {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCourses();
        onUpdate();
      }
    } catch (error) {
      console.error('Erro ao deletar curso:', error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-indigo-500" />
        Lista de Cursos
      </h2>
      <div className="mt-4 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-800">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-400">
                    Título
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-400">
                    Descrição
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-400">
                    Módulos
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white">
                      {course.title}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                      {course.description}
                    </td>
                    <td className="px-3 py-4 text-sm">
                      <span className="inline-flex items-center rounded-full bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400">
                        {course.totalModules} módulos
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {courses.length === 0 && (
              <p className="text-gray-400 text-center mt-4">Nenhum curso encontrado</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 