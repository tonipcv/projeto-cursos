'use client';

import React from 'react';
import AddCourseForm from '@/components/AddCourseForm';
import CourseList from '@/components/CourseList';

export default function AdminCoursesPage() {
  const handleUpdate = () => {
    // Atualiza a lista de cursos
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-6">
        <AddCourseForm onUpdate={handleUpdate} />
        <CourseList onUpdate={handleUpdate} />
      </div>
    </div>
  );
}