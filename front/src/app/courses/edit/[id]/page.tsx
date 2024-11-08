'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { Course } from '@/types';

export default function EditCourse() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnailUrl: '',
    coverUrl: ''
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const course = await api.courses.get(parseInt(courseId));
        setFormData({
          title: course.title,
          description: course.description || '',
          thumbnailUrl: course.thumbnailUrl || '',
          coverUrl: course.coverUrl || ''
        });
      } catch (error) {
        console.error('Erro ao carregar curso:', error);
        alert('Erro ao carregar curso');
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.courses.update(parseInt(courseId), formData);
      router.push('/');
    } catch (error) {
      console.error('Erro ao atualizar curso:', error);
      alert('Erro ao atualizar curso');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark to-dark-lighter">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link 
            href="/"
            className="text-gray-300 hover:text-primary flex items-center mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Voltar
          </Link>

          <h1 className="text-3xl font-bold text-white mb-8">Editar Curso</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título do Curso
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-dark-lighter border border-primary/10 rounded-lg text-white focus:border-primary transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-dark-lighter border border-primary/10 rounded-lg text-white focus:border-primary transition-colors"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL da Thumbnail
              </label>
              <input
                type="url"
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                className="w-full px-3 py-2 bg-dark-lighter border border-primary/10 rounded-lg text-white focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL da Capa
              </label>
              <input
                type="url"
                value={formData.coverUrl}
                onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                className="w-full px-3 py-2 bg-dark-lighter border border-primary/10 rounded-lg text-white focus:border-primary transition-colors"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                href="/"
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 