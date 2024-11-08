'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  PlayCircle, 
  BookOpen, 
  BarChart,
  Clock,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  duration: string | null;
  videoId: string | null;
  order: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

interface CourseStats {
  totalModules: number;
  totalLessons: number;
  totalDuration: string;
  completionRate: number;
}

export default function CourseView() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [stats, setStats] = useState<CourseStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [showNewModuleForm, setShowNewModuleForm] = useState(false);
  const [showNewLessonForm, setShowNewLessonForm] = useState(false);
  const [newModuleData, setNewModuleData] = useState({
    title: '',
    description: '',
    thumbnailUrl: '',
    coverUrl: '',
    order: 0
  });
  const [newLessonData, setNewLessonData] = useState({
    title: '',
    description: '',
    content: '',
    videoUrl: '',
    thumbnailUrl: '',
    materialUrl: '',
    moduleId: '',
    order: 0
  });
  const [showEditModuleForm, setShowEditModuleForm] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await api.courses.get(courseId);
        setCourse(data);
        
        if (data.modules.length > 0) {
          setActiveModuleId(data.modules[0].id);
        }

        // Calcular estatísticas reais
        const totalModules = data.modules.length;
        const totalLessons = data.modules.reduce(
          (acc: number, module: Module) => acc + module.lessons.length, 
          0
        );
        
        // Calcular duração total
        const totalMinutes = data.modules.reduce((acc: number, module: Module) => {
          return acc + module.lessons.reduce((lessonAcc: number, lesson: Lesson) => {
            if (lesson.duration) {
              const [minutes, seconds] = lesson.duration.split(':').map(Number);
              return lessonAcc + minutes + (seconds / 60);
            }
            return lessonAcc;
          }, 0);
        }, 0);
        
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.round(totalMinutes % 60);
        
        setStats({
          totalModules,
          totalLessons,
          totalDuration: `${hours}h ${minutes}min`,
          completionRate: 0 // Implementar lógica de progresso quando necessário
        });
      } catch (error) {
        console.error('Erro ao carregar curso:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.modules.create({
        ...newModuleData,
        courseId,
        order: course?.modules.length || 0
      });
      
      const updatedCourse = await api.courses.get(courseId);
      setCourse(updatedCourse);
      setShowNewModuleForm(false);
      setNewModuleData({ title: '', description: '', thumbnailUrl: '', coverUrl: '', order: 0 });
    } catch (error) {
      console.error('Erro ao criar módulo:', error);
      alert('Erro ao criar módulo');
    }
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.lessons.create({
        ...newLessonData,
        order: course?.modules.find(m => m.id === newLessonData.moduleId)?.lessons.length || 0
      });
      
      const updatedCourse = await api.courses.get(courseId);
      setCourse(updatedCourse);
      setShowNewLessonForm(false);
      setNewLessonData({ title: '', description: '', content: '', videoUrl: '', thumbnailUrl: '', materialUrl: '', moduleId: '', order: 0 });
    } catch (error) {
      console.error('Erro ao criar aula:', error);
      alert('Erro ao criar aula');
    }
  };

  const handleEditModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule) return;

    try {
      await api.modules.update(editingModule.id, {
        title: editingModule.title,
        description: editingModule.description,
        thumbnailUrl: editingModule.thumbnailUrl,
        coverUrl: editingModule.coverUrl,
        order: editingModule.order
      });
      
      const updatedCourse = await api.courses.get(parseInt(courseId));
      setCourse(updatedCourse);
      setShowEditModuleForm(false);
      setEditingModule(null);
    } catch (error) {
      console.error('Erro ao atualizar módulo:', error);
      alert('Erro ao atualizar módulo');
    }
  };

  const handleDeleteModule = async (moduleId: number) => {
    if (!confirm('Tem certeza que deseja excluir este módulo?')) return;

    try {
      await api.modules.delete(moduleId);
      const updatedCourse = await api.courses.get(parseInt(courseId));
      setCourse(updatedCourse);
    } catch (error) {
      console.error('Erro ao deletar módulo:', error);
      alert('Erro ao deletar módulo');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-gray-300">Carregando curso...</span>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="text-red-400 text-center">
          Curso não encontrado
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark to-dark-lighter">
      {/* Header */}
      <header className="bg-dark-card border-b border-primary/20 p-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4">
            <Link 
              href="/"
              className="text-gray-300 hover:text-primary flex items-center transition-colors"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar para Home
            </Link>
            <div className="flex space-x-2">
              <Link
                href={`/admin/courses/edit/${course.id}`}
                className="flex items-center px-3 py-1 bg-primary/20 text-primary hover:bg-primary/30 rounded transition-colors"
              >
                <Edit className="h-4 w-4 mr-1" />
                Editar Curso
              </Link>
              <button
                onClick={() => setShowNewModuleForm(true)}
                className="flex items-center px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                Novo Módulo
              </button>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-primary-light">{course.title}</h1>
          <p className="text-gray-400 mt-2">{course.description}</p>
        </div>
      </header>

      {/* Estatísticas do Curso */}
      {stats && (
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total de Módulos */}
            <div className="glass-effect rounded-lg border border-primary/10">
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-gray-400 text-sm">Total de Módulos</p>
                  <h3 className="text-xl font-bold text-primary-light">{stats.totalModules}</h3>
                </div>
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </div>

            {/* Total de Aulas */}
            <div className="glass-effect rounded-lg border border-primary/10">
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-gray-400 text-sm">Total de Aulas</p>
                  <h3 className="text-xl font-bold text-primary-light">{stats.totalLessons}</h3>
                </div>
                <PlayCircle className="h-8 w-8 text-primary" />
              </div>
            </div>

            {/* Duração Total */}
            <div className="glass-effect rounded-lg border border-primary/10">
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-gray-400 text-sm">Duração Total</p>
                  <h3 className="text-xl font-bold text-primary-light">{stats.totalDuration}</h3>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </div>

            {/* Taxa de Conclusão */}
            <div className="glass-effect rounded-lg border border-primary/10">
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-gray-400 text-sm">Taxa de Conclusão</p>
                  <h3 className="text-xl font-bold text-primary-light">{stats.completionRate}%</h3>
                </div>
                <BarChart className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Módulos */}
          <div className="lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-primary-light flex items-center">
                <BookOpen className="mr-2" />
                Módulos do Curso
              </h2>
              <button
                onClick={() => setShowNewModuleForm(true)}
                className="text-primary hover:text-primary-light transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              {course.modules
                .sort((a, b) => a.order - b.order)
                .map((module) => (
                <div 
                  key={module.id}
                  className={`glass-effect rounded-lg transition-all cursor-pointer border
                    ${activeModuleId === module.id 
                      ? 'bg-primary/20 border-primary' 
                      : 'border-primary/10 hover:border-primary/30'
                    }`}
                  onClick={() => setActiveModuleId(module.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white">{module.title}</h3>
                      <p className="text-sm text-gray-300 mt-1">{module.description}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-sm text-gray-400">
                          {module.lessons.length} aulas
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        className="text-gray-400 hover:text-white transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingModule(module);
                          setShowEditModuleForm(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-gray-400 hover:text-red-400 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteModule(module.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lista de Aulas */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <PlayCircle className="mr-2" />
                Aulas
              </h2>
              {activeModuleId && (
                <button
                  onClick={() => {
                    setNewLessonData(prev => ({ ...prev, moduleId: activeModuleId }));
                    setShowNewLessonForm(true);
                  }}
                  className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Nova Aula
                </button>
              )}
            </div>
            <div className="space-y-4">
              {activeModuleId && course.modules
                .find(m => m.id === activeModuleId)?.lessons
                .sort((a, b) => a.order - b.order)
                .map((lesson) => (
                <div 
                  key={lesson.id}
                  className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{lesson.title}</h3>
                      <p className="text-sm text-gray-300 mt-1">{lesson.description}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      {lesson.duration && (
                        <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">
                          {lesson.duration}
                        </span>
                      )}
                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-white">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button className="mt-4 flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Assistir aula
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Novo Módulo */}
      {showNewModuleForm && (
        <div className="fixed inset-0 bg-dark/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-effect rounded-lg p-6 w-full max-w-md border border-primary/20">
            <h3 className="text-xl font-bold text-white mb-4">Novo Módulo</h3>
            <form onSubmit={handleCreateModule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={newModuleData.title}
                  onChange={(e) => setNewModuleData({ ...newModuleData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-lighter border border-primary/10 rounded-lg text-white focus:border-primary transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea
                  value={newModuleData.description}
                  onChange={(e) => setNewModuleData({ ...newModuleData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-lighter border border-primary/10 rounded-lg text-white focus:border-primary transition-colors"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL da Thumbnail
                </label>
                <input
                  type="url"
                  value={newModuleData.thumbnailUrl}
                  onChange={(e) => setNewModuleData({ ...newModuleData, thumbnailUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-lighter border border-primary/10 rounded-lg text-white focus:border-primary transition-colors"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL da Capa
                </label>
                <input
                  type="url"
                  value={newModuleData.coverUrl}
                  onChange={(e) => setNewModuleData({ ...newModuleData, coverUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-lighter border border-primary/10 rounded-lg text-white focus:border-primary transition-colors"
                  placeholder="https://exemplo.com/capa.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ordem
                </label>
                <input
                  type="number"
                  value={newModuleData.order}
                  onChange={(e) => setNewModuleData({ ...newModuleData, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-dark-lighter border border-primary/10 rounded-lg text-white focus:border-primary transition-colors"
                  min="0"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewModuleForm(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Criar Módulo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Nova Aula */}
      {showNewLessonForm && (
        <div className="fixed inset-0 bg-dark/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-effect rounded-lg p-6 w-full max-w-md border border-primary/20">
            <h3 className="text-xl font-bold text-white mb-4">Nova Aula</h3>
            <form onSubmit={handleCreateLesson} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={newLessonData.title}
                  onChange={(e) => setNewLessonData({ ...newLessonData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-lighter border border-primary/10 rounded-lg text-white focus:border-primary transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea
                  value={newLessonData.description}
                  onChange={(e) => setNewLessonData({ ...newLessonData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-lighter border border-primary/10 rounded-lg text-white focus:border-primary transition-colors"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Conteúdo
                </label>
                <textarea
                  value={newLessonData.content}
                  onChange={(e) => setNewLessonData({ ...newLessonData, content: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-lighter border border-primary/10 rounded-lg text-white focus:border-primary transition-colors"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL do Vídeo
                </label>
                <input
                  type="url"
                  value={newLessonData.videoUrl}
                  onChange={(e) => setNewLessonData({ ...newLessonData, videoUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-lighter border border-primary/10 rounded-lg text-white focus:border-primary transition-colors"
                  placeholder="https://exemplo.com/video.mp4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL da Thumbnail
                </label>
                <input
                  type="url"
                  value={newLessonData.thumbnailUrl}
                  onChange={(e) => setNewLessonData({ ...newLessonData, thumbnailUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-lighter border border-primary/10 rounded-lg text-white focus:border-primary transition-colors"
                  placeholder="https://exemplo.com/thumbnail.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL do Material
                </label>
                <input
                  type="url"
                  value={newLessonData.materialUrl}
                  onChange={(e) => setNewLessonData({ ...newLessonData, materialUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-lighter border border-primary/10 rounded-lg text-white focus:border-primary transition-colors"
                  placeholder="https://exemplo.com/material.pdf"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ordem
                </label>
                <input
                  type="number"
                  value={newLessonData.order}
                  onChange={(e) => setNewLessonData({ ...newLessonData, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-dark-lighter border border-primary/10 rounded-lg text-white focus:border-primary transition-colors"
                  min="0"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewLessonForm(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Criar Aula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Edição de Módulo */}
      {showEditModuleForm && editingModule && (
        <div className="fixed inset-0 bg-dark/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-effect rounded-lg p-6 w-full max-w-md border border-primary/20">
            <h3 className="text-xl font-bold text-white mb-4">Editar Módulo</h3>
            <form onSubmit={handleEditModule} className="space-y-4">
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
                  value={editingModule.description}
                  onChange={(e) => setEditingModule({
                    ...editingModule,
                    description: e.target.value
                  })}
                  className="w-full px-3 py-2 bg-dark-lighter border border-primary/10 rounded-lg text-white focus:border-primary transition-colors"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL da Thumbnail
                </label>
                <input
                  type="url"
                  value={editingModule.thumbnailUrl || ''}
                  onChange={(e) => setEditingModule({
                    ...editingModule,
                    thumbnailUrl: e.target.value
                  })}
                  className="w-full px-3 py-2 bg-dark-lighter border border-primary/10 rounded-lg text-white focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL da Capa
                </label>
                <input
                  type="url"
                  value={editingModule.coverUrl || ''}
                  onChange={(e) => setEditingModule({
                    ...editingModule,
                    coverUrl: e.target.value
                  })}
                  className="w-full px-3 py-2 bg-dark-lighter border border-primary/10 rounded-lg text-white focus:border-primary transition-colors"
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

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModuleForm(false);
                    setEditingModule(null);
                  }}
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
    </div>
  );
} 