import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Course } from '@/types';

interface CourseListProps {
  onUpdate: () => void;
}

export default function CourseList({ onUpdate }: CourseListProps) {
  const [courses, setCourses] = useState<Course[]>([]);

  const fetchCourses = async () => {
    try {
      const data = await api.courses.list();
      setCourses(data);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [onUpdate]);

  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <div key={course.id} className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold text-primary-light">{course.title}</h3>
          <p className="text-gray-400">{course.description}</p>
        </div>
      ))}
    </div>
  );
} 