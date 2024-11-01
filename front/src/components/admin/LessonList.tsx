'use client';

import React, { useState, useEffect } from 'react';
import { Video, Trash2 } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  moduleTitle: string;
  courseTitle: string;
}

interface LessonListProps {
  onUpdate: () => void;
}

export default function LessonList({ onUpdate }: LessonListProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await fetch('/api/lessons');
      const data = await response.json();
      
      // Verifica se data é um array
      if (Array.isArray(data)) {
        setLessons(data);
        setError('');
      } else {
        console.error('Resposta inválida:', data);
        setLessons([]);
        setError('Erro ao carregar aulas');
      }
    } catch (error: any) {
      console.error('Erro ao buscar aulas:', error);
      setLessons([]);
      setError('Erro ao carregar aulas');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/lessons/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchLessons();
        onUpdate();
      }
    } catch (error: any) {
      console.error('Erro ao deletar aula:', error);
      setError('Erro ao deletar aula');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Video className="h-6 w-6 text-indigo-500" />
        Lista de Aulas
      </h2>
      {error && (
        <p className="text-red-500 text-center mb-4">{error}</p>
      )}
      <div className="space-y-4">
        {Array.isArray(lessons) && lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-gray-800 p-4 rounded-lg border border-gray-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-white">{lesson.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{lesson.description}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-indigo-400">Módulo: {lesson.moduleTitle}</p>
                  <p className="text-xs text-indigo-400">Curso: {lesson.courseTitle}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(lesson.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
        {(!lessons || lessons.length === 0) && !error && (
          <p className="text-gray-400 text-center">Nenhuma aula encontrada</p>
        )}
      </div>
    </div>
  );
} 