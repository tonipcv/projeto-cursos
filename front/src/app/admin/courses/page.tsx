'use client';

import { useState } from 'react';
import AddCourseForm from '../../../components/admin/AddCourseForm';
import CourseList from '../../../components/admin/CourseList';

export default function CoursesAdmin() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Cursos</h1>
      <div className="grid grid-cols-1 gap-6">
        <AddCourseForm />
        <CourseList />
      </div>
    </div>
  );
} np