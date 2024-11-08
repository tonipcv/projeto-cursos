'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

interface CreateLessonModalProps {
  moduleId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateLessonModal({
  moduleId,
  isOpen,
  onClose,
  onSuccess
}: CreateLessonModalProps) {
  const [formData, setFormData] = useState({
    moduleId: moduleId,
    title: '',
    content: '',
    videoUrl: '',
    thumbnailUrl: '',
    materialUrl: '',
    order: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      console.log('Enviando dados:', formData);

      const response = await api.lessons.create({
        ...formData,
        moduleId
      });

      console.log('Resposta:', response);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro detalhado ao criar aula:', error);
      alert('Erro ao criar aula. Verifique o console para mais detalhes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-dark/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-effect rounded-lg p-6 w-full max-w-md border border-primary/20">
        <h3 className="text-xl font-bold text-white mb-4">Nova Aula</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Título
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
              Conteúdo
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 bg-dark-lighter border border-primary/10 rounded-lg text-white focus:border-primary transition-colors"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL do Vídeo
            </label>
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full px-3 py-2 bg-dark-lighter border border-primary/10 rounded-lg text-white focus:border-primary transition-colors"
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
              URL do Material
            </label>
            <input
              type="url"
              value={formData.materialUrl}
              onChange={(e) => setFormData({ ...formData, materialUrl: e.target.value })}
              className="w-full px-3 py-2 bg-dark-lighter border border-primary/10 rounded-lg text-white focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ordem
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-dark-lighter border border-primary/10 rounded-lg text-white focus:border-primary transition-colors"
              min="0"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Criando...' : 'Criar Aula'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 