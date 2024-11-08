'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Course } from '@/types/course';

export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await api.courses.list();
        const coursesWithCounts = data.map(course => ({
          ...course,
          modulesCount: course.modules.length,
          lessonsCount: course.modules.reduce((acc, module) => acc + module.lessons.length, 0)
        }));
        setCourses(coursesWithCounts);
      } catch (error) {
        console.error('Erro ao carregar cursos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-dark-card rounded-lg p-4">
            <h2 className="text-xl font-semibold text-primary-light mb-2">
              {course.title}
            </h2>
            <p className="text-gray-400 mb-4 line-clamp-2">
              {course.description}
            </p>
            <div className="flex gap-4">
              <span className="text-sm text-gray-500">
                {course.modulesCount} módulos
              </span>
              <span className="text-sm text-gray-500">
                {course.lessonsCount} aulas
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 