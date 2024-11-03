'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Course, Module } from '@/types/course';
import Image from 'next/image';

export default function EditLesson() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params?.id as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    embedUrl: '',
    duration: '',
    moduleId: '',
    order: 0
  });
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchData = async () => {
      try {
        // Buscar aula
        const lessonResponse = await fetch(`/api/lessons/${lessonId}`);
        if (!lessonResponse.ok) throw new Error('Falha ao carregar aula');
        const lessonData = await lessonResponse.json();

        // Buscar cursos
        const coursesResponse = await fetch('/api/courses');
        if (!coursesResponse.ok) throw new Error('Falha ao carregar cursos');
        const coursesData = await coursesResponse.json();

        setCourses(coursesData);
        setSelectedCourseId(lessonData.module.courseId);
        
        // Buscar módulos do curso
        const courseResponse = await fetch(`/api/courses/${lessonData.module.courseId}`);
        if (!courseResponse.ok) throw new Error('Falha ao carregar módulos');
        const courseData = await courseResponse.json();
        setModules(courseData.modules);

        setFormData({
          title: lessonData.title,
          description: lessonData.description || '',
          embedUrl: lessonData.embedUrl || '',
          duration: lessonData.duration || '',
          moduleId: lessonData.moduleId,
          order: lessonData.order
        });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar dados. Tente novamente.');
      }
    };

    if (lessonId) {
      fetchData();
    }
  }, [lessonId, mounted]);

  const handleCourseChange = async (courseId: string) => {
    setSelectedCourseId(courseId);
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      if (!response.ok) throw new Error('Falha ao carregar módulos');
      const data = await response.json();
      setModules(data.modules);
      setFormData(prev => ({ ...prev, moduleId: data.modules[0]?.id || '' }));
    } catch (error) {
      console.error('Erro ao carregar módulos:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Falha ao atualizar aula');

      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Erro ao atualizar aula:', error);
      alert('Erro ao atualizar aula. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload do arquivo
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Falha ao fazer upload');
      
      const data = await response.json();
      setFormData(prev => ({ ...prev, thumbnail: data.url }));
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload da imagem');
    } finally {
      setIsUploading(false);
    }
  };

  // Função para lidar com a mudança no campo de embed
  const handleEmbedChange = (embedCode: string) => {
    setFormData(prev => ({ ...prev, embedUrl: embedCode }));
  };

  // Função para renderizar o preview do vídeo
  const renderVideoPreview = () => {
    if (!formData.embedUrl) return null;

    return (
      <div 
        className="aspect-video w-full rounded-lg overflow-hidden bg-gray-800 border border-gray-700"
        dangerouslySetInnerHTML={{ 
          __html: formData.embedUrl 
        }}
      />
    );
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950 p-8" suppressHydrationWarning>
      <div className="max-w-2xl mx-auto">
        <Link 
          href="/admin/dashboard"
          className="text-gray-300 hover:text-white flex items-center mb-6"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Voltar ao Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-white mb-8">Editar Aula</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="courseId" className="block text-sm font-medium text-gray-300 mb-2">
              Curso
            </label>
            <select
              id="courseId"
              value={selectedCourseId}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            >
              <option value="">Selecione um curso</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="moduleId" className="block text-sm font-medium text-gray-300 mb-2">
              Módulo
            </label>
            <select
              id="moduleId"
              value={formData.moduleId}
              onChange={(e) => setFormData({ ...formData, moduleId: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            >
              <option value="">Selecione um módulo</option>
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Título da Aula
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

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Código de Incorporação (Embed)
            </label>
            <textarea
              value={formData.embedUrl}
              onChange={(e) => handleEmbedChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              rows={6}
              placeholder="Cole aqui o código de incorporação do vídeo..."
            />
          </div>

          {/* Preview do Vídeo */}
          {formData.embedUrl && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Preview do Vídeo
              </label>
              {renderVideoPreview()}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duração
            </label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="Ex: 10:30"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>

          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-300 mb-2">
              Ordem
            </label>
            <input
              type="number"
              id="order"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Thumbnail
            </label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label 
                  htmlFor="thumbnail"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-violet-500 transition-colors"
                >
                  {thumbnailPreview || formData.thumbnail ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={thumbnailPreview || formData.thumbnail}
                        alt="Thumbnail preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Clique para fazer upload</span>
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG (MAX. 2MB)</p>
                    </div>
                  )}
                  <input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleThumbnailUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
              {(thumbnailPreview || formData.thumbnail) && (
                <button
                  type="button"
                  onClick={() => {
                    setThumbnailPreview(null);
                    setFormData(prev => ({ ...prev, thumbnail: '' }));
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
            {isUploading && (
              <div className="mt-2 text-sm text-gray-400">
                Fazendo upload...
              </div>
            )}
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