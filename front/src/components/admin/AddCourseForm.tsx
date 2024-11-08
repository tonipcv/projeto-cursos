'use client';

import React from 'react';

interface AddCourseFormProps {
  onSubmit: (data: any) => void;
}

export default function AddCourseForm({ onSubmit }: AddCourseFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implementar lógica do formulário
    onSubmit({});
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Conteúdo do formulário */}
    </form>
  );
} 