'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Plus, Edit, Trash2, PlayCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Course, Module, Lesson } from '@/types/course';
import CreateModuleForm from '@/components/admin/CreateModuleForm';
import CreateLessonForm from '@/components/admin/CreateLessonForm';

export default function CourseView({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null);
  const [showNewModuleForm, setShowNewModuleForm] = useState(false);
  const [showNewLessonForm, setShowNewLessonForm] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<Module | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);

  const fetchCourse = async () => {
    try {
      setIsLoading(true);
      const data = await api.courses.get(parseInt(params.id));
      setCourse(data);
      if (data.modules.length > 0) {
        setActiveModuleId(data.modules[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar curso:', error);
      setError('Erro ao carregar curso');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [params.id]);

  const handleDeleteModule = async () => {
    if (!moduleToDelete) return;
    try {
      await api.modules.delete(moduleToDelete.id);
      await fetchCourse();
      setShowDeleteConfirm(false);
      setModuleToDelete(null);
      if (activeModuleId === moduleToDelete.id) {
        setActiveModuleId(null);
      }
    } catch (error) {
      console.error('Erro ao deletar módulo:', error);
      alert('Erro ao deletar módulo');
    }
  };

  const handleUpdateModule = async (moduleData: Partial<Module>) => {
    if (!editingModule) return;
    try {
      await api.modules.update(editingModule.id, moduleData);
      await fetchCourse();
      setEditingModule(null);
    } catch (error) {
      console.error('Erro ao atualizar módulo:', error);
      alert('Erro ao atualizar módulo');
    }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    try {
      await api.lessons.delete(lessonId);
      await fetchCourse();
    } catch (error) {
      console.error('Erro ao deletar aula:', error);
      alert('Erro ao deletar aula');
    }
  };

  const handleCreateModule = async () => {
    try {
      const newModule = await api.modules.create({
        courseId: parseInt(params.id),
        title: 'Novo Módulo',
        description: 'Descrição do módulo',
        order: course?.modules.length || 0
      });
      await fetchCourse();
      setActiveModuleId(newModule.id);
    } catch (error) {
      console.error('Erro ao criar módulo:', error);
      alert('Erro ao criar módulo');
    }
  };

  const handleModuleClick = (moduleId: number) => {
    setActiveModuleId(moduleId);
  };

  const activeModule = course?.modules.find(m => m.id === activeModuleId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark to-dark-lighter flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-400">Carregando curso...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark to-dark-lighter flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Link
            href="/"
            className="text-primary hover:text-primary-light transition-colors"
          >
            Voltar para Home
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark to-dark-lighter flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Curso não encontrado</p>
          <Link
            href="/"
            className="text-primary hover:text-primary-light transition-colors"
          >
            Voltar para Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark to-dark-lighter">
      <main className="container mx-auto px-4 py-8">
        {/* Header do Curso */}
        <div className="mb-8">
          <Link 
            href="/"
            className="text-gray-400 hover:text-primary mb-4 inline-flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white">{course?.title}</h1>
              {course?.description && (
                <p className="mt-2 text-gray-400">{course.description}</p>
              )}
            </div>
            <Link
              href={`/courses/edit/${params.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
            >
              <Edit className="h-4 w-4" />
              Editar Curso
            </Link>
          </div>
        </div>

        {/* Lista de Módulos e Aulas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Módulos */}
          <div className="lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-primary-light">Módulos</h2>
              <button
                onClick={() => setShowNewModuleForm(true)}
                className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Novo Módulo
              </button>
            </div>
            <div className="space-y-4">
              {course?.modules.map((module) => (
                <div
                  key={module.id}
                  className={`relative group p-4 rounded-lg transition-all ${
                    activeModuleId === module.id
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-dark-lighter text-gray-300 hover:bg-primary/10 border border-transparent'
                  }`}
                >
                  <button
                    onClick={() => setActiveModuleId(module.id)}
                    className="w-full text-left"
                  >
                    <h3 className="font-semibold">{module.title}</h3>
                    {module.description && (
                      <p className="text-sm text-gray-400 mt-1">{module.description}</p>
                    )}
                    <span className="text-xs text-gray-500 mt-2 block">
                      {module.lessons.length} aulas
                    </span>
                  </button>

                  {/* Ações do Módulo */}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingModule(module);
                      }}
                      className="p-1 text-gray-400 hover:text-primary transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setModuleToDelete(module);
                        setShowDeleteConfirm(true);
                      }}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lista de Aulas */}
          <div className="lg:col-span-2">
            {activeModule ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-primary-light">
                      Aulas de {activeModule.title}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      {activeModule.lessons.length} aulas neste módulo
                    </p>
                  </div>
                  <button
                    onClick={() => setShowNewLessonForm(true)}
                    className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Nova Aula
                  </button>
                </div>

                <div className="space-y-4">
                  {activeModule.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="glass-effect rounded-lg p-4 border border-primary/10 hover:border-primary/30 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-white">{lesson.title}</h3>
                          {lesson.content && (
                            <p className="mt-1 text-sm text-gray-400">{lesson.content}</p>
                          )}
                        </div>
                        {lesson.videoUrl && (
                          <a
                            href={lesson.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary-light transition-colors"
                          >
                            <PlayCircle className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <p className="text-gray-400 mb-4">
                  Selecione um módulo para ver suas aulas
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modais */}
        {showNewModuleForm && (
          <div className="fixed inset-0 bg-dark/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="glass-effect rounded-lg p-6 w-full max-w-md border border-primary/20">
              <h3 className="text-xl font-bold text-white mb-4">Novo Módulo</h3>
              <CreateModuleForm
                courseId={parseInt(params.id)}
                onSuccess={() => {
                  fetchCourse();
                  setShowNewModuleForm(false);
                }}
                onCancel={() => setShowNewModuleForm(false)}
              />
            </div>
          </div>
        )}

        {showNewLessonForm && activeModuleId && (
          <div className="fixed inset-0 bg-dark/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="glass-effect rounded-lg p-6 w-full max-w-md border border-primary/20">
              <h3 className="text-xl font-bold text-white mb-4">Nova Aula</h3>
              <CreateLessonForm
                moduleId={activeModuleId}
                onSuccess={() => {
                  fetchCourse();
                  setShowNewLessonForm(false);
                }}
                onCancel={() => setShowNewLessonForm(false)}
              />
            </div>
          </div>
        )}

        {/* Modal de Confirmação de Exclusão */}
        {showDeleteConfirm && moduleToDelete && (
          <div className="fixed inset-0 bg-dark/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="glass-effect rounded-lg p-6 max-w-md border border-primary/20">
              <h3 className="text-xl font-bold text-white mb-4">Confirmar Exclusão</h3>
              <p className="text-gray-300 mb-6">
                Tem certeza que deseja excluir o módulo "{moduleToDelete.title}"?
                Esta ação não pode ser desfeita e todas as aulas deste módulo serão excluídas.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setModuleToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteModule}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Excluir Módulo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Edição de Módulo */}
        {editingModule && (
          <div className="fixed inset-0 bg-dark/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="glass-effect rounded-lg p-6 w-full max-w-md border border-primary/20">
              <h3 className="text-xl font-bold text-white mb-4">Editar Módulo</h3>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateModule({
                    title: editingModule.title,
                    description: editingModule.description,
                    order: editingModule.order
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={editingModule.title}
                    onChange={(e) => setEditingModule({
                      ...editingModule,
                      title: e.target.value
                    })}
                    className="w-full px-3 py-2 bg-dark-lighter border border-primary/10 rounded-lg text-white focus:border-primary transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={editingModule.description || ''}
                    onChange={(e) => setEditingModule({
                      ...editingModule,
                      description: e.target.value
                    })}
                    className="w-full px-3 py-2 bg-dark-lighter border border-primary/10 rounded-lg text-white focus:border-primary transition-colors"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ordem
                  </label>
                  <input
                    type="number"
                    value={editingModule.order}
                    onChange={(e) => setEditingModule({
                      ...editingModule,
                      order: parseInt(e.target.value)
                    })}
                    className="w-full px-3 py-2 bg-dark-lighter border border-primary/10 rounded-lg text-white focus:border-primary transition-colors"
                    min="0"
                    required
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setEditingModule(null)}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 