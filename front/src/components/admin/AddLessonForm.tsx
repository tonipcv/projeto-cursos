'use client';

import React, { useState, useEffect } from 'react';
import { Video } from 'lucide-react';

interface Module {
  id: string;
  title: string;
  courseTitle: string;
}

interface AddLessonFormProps {
  onLessonAdded: () => void;
}

export default function AddLessonForm({ onLessonAdded }: AddLessonFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [modules, setModules] = useState<Module[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await fetch('/api/modules');
      const data = await response.json();
      console.log('Módulos carregados:', data);
      if (Array.isArray(data)) {
        setModules(data);
      }
    } catch (error) {
      console.error('Erro ao buscar módulos:', error);
      setError('Erro ao carregar módulos');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Enviando dados:', { title, description, moduleId, videoUrl });

      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          moduleId,
          videoUrl,
        }),
      });

      const data = await response.json();
      console.log('Resposta:', data);

      if (response.ok) {
        setTitle('');
        setDescription('');
        setModuleId('');
        setVideoUrl('');
        onLessonAdded();
      } else {
        setError(data.error || 'Erro ao adicionar aula');
      }
    } catch (error) {
      console.error('Erro ao adicionar aula:', error);
      setError('Erro ao adicionar aula');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Video className="h-6 w-6 text-indigo-500" />
        Adicionar Aula
      </h2>
      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="module" className="block text-sm font-medium text-gray-400 mb-1">
            Módulo
          </label>
          <select
            id="module"
            value={moduleId}
            onChange={(e) => setModuleId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 px-3"
            required
          >
            <option value="">Selecione um módulo</option>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.title} - {module.courseTitle}
              </option>
            ))}
          </select>
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
          />
        </div>
        <div>
          <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-400 mb-1">
            URL do Vídeo
          </label>
          <input
            type="url"
            id="videoUrl"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 px-3"
            required
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
            {loading ? 'Adicionando...' : 'Adicionar Aula'}
          </button>
        </div>
      </form>
    </div>
  );
} 