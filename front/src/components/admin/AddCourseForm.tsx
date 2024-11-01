'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { PlusCircle, BookOpen, FileText } from 'lucide-react';

interface AddCourseFormProps {
  onCourseAdded?: () => void;
}

export default function AddCourseForm({ onCourseAdded }: AddCourseFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar curso');
      }

      setTitle('');
      setDescription('');
      
      if (onCourseAdded) {
        onCourseAdded();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar curso');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-xl border border-gray-800">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="h-6 w-6 text-indigo-500" />
        <h2 className="text-xl font-semibold text-gray-100">Adicionar Novo Curso</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <FileText className="h-4 w-4 text-gray-500" />
            Título do Curso
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                     text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 
                     focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Digite o título do curso"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <FileText className="h-4 w-4 text-gray-500" />
            Descrição
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                     text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 
                     focus:ring-indigo-500 focus:border-transparent transition-all"
            rows={4}
            placeholder="Digite a descrição do curso"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 
                   bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium
                   transition-colors duration-200 ease-in-out
                   ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                   focus:outline-none focus:ring-2 focus:ring-offset-2 
                   focus:ring-indigo-500 focus:ring-offset-gray-900`}
        >
          <PlusCircle className="h-5 w-5" />
          {isLoading ? 'Adicionando...' : 'Adicionar Curso'}
        </button>
      </form>

      {/* Preview do Curso */}
      {(title || description) && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Preview:</h3>
          <div className="space-y-2">
            {title && (
              <p className="text-gray-200 font-medium">{title}</p>
            )}
            {description && (
              <p className="text-gray-400 text-sm">{description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 