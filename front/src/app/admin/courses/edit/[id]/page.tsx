'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditCourse() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`);
        if (!response.ok) throw new Error('Falha ao carregar curso');
        const data = await response.json();
        setFormData({
          title: data.title,
          description: data.description
        });
      } catch (error) {
        console.error('Erro ao carregar curso:', error);
        alert('Erro ao carregar curso. Tente novamente.');
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Falha ao atualizar curso');

      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Erro ao atualizar curso:', error);
      alert('Erro ao atualizar curso. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <Link 
          href="/admin/dashboard"
          className="text-gray-300 hover:text-white flex items-center mb-6"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Voltar ao Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-white mb-8">Editar Curso</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Título do Curso
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 py-3 px-4 bg-violet-600/20 text-violet-500 rounded-lg hover:bg-violet-600/30 transition-all border border-violet-500/20 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            
            <Link
              href="/admin/dashboard"
              className="flex-1 py-3 px-4 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors text-center"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 