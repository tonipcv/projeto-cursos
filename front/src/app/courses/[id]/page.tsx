'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  PlayCircle, 
  BookOpen, 
  CheckCircle,
  Plus,
  BarChart,
  Clock,
  Users,
  Settings,
  Edit,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

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
  const [newModuleData, setNewModuleData] = useState({ title: '', description: '' });
  const [newLessonData, setNewLessonData] = useState({ 
    title: '', 
    description: '', 
    moduleId: '',
    duration: '',
    videoId: '' 
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`);
        if (!response.ok) throw new Error('Falha ao carregar curso');
        const data = await response.json();
        setCourse(data);
        if (data.modules.length > 0) {
          setActiveModuleId(data.modules[0].id);
        }

        // Simular estatísticas do curso (substitua por chamada real à API)
        setStats({
          totalModules: data.modules.length,
          totalLessons: data.modules.reduce((acc: number, module: Module) => acc + module.lessons.length, 0),
          totalDuration: '10h 30min',
          completionRate: 75
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
      const response = await fetch('/api/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newModuleData,
          courseId,
          order: course?.modules.length || 0
        }),
      });

      if (!response.ok) throw new Error('Falha ao criar módulo');
      
      // Recarregar curso para mostrar novo módulo
      const updatedCourse = await fetch(`/api/courses/${courseId}`).then(res => res.json());
      setCourse(updatedCourse);
      setShowNewModuleForm(false);
      setNewModuleData({ title: '', description: '' });
    } catch (error) {
      console.error('Erro ao criar módulo:', error);
      alert('Erro ao criar módulo');
    }
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newLessonData,
          order: course?.modules.find(m => m.id === newLessonData.moduleId)?.lessons.length || 0
        }),
      });

      if (!response.ok) throw new Error('Falha ao criar aula');
      
      // Recarregar curso para mostrar nova aula
      const updatedCourse = await fetch(`/api/courses/${courseId}`).then(res => res.json());
      setCourse(updatedCourse);
      setShowNewLessonForm(false);
      setNewLessonData({ title: '', description: '', moduleId: '', duration: '', videoId: '' });
    } catch (error) {
      console.error('Erro ao criar aula:', error);
      alert('Erro ao criar aula');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-white">Carregando curso...</span>
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
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4">
            <Link 
              href="/"
              className="text-gray-300 hover:text-white flex items-center"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar para Home
            </Link>
            <div className="flex space-x-2">
              <Link
                href={`/admin/courses/edit/${course.id}`}
                className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Edit className="h-4 w-4 mr-1" />
                Editar Curso
              </Link>
              <button
                onClick={() => setShowNewModuleForm(true)}
                className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Novo Módulo
              </button>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">{course.title}</h1>
          <p className="text-gray-400 mt-2">{course.description}</p>
        </div>
      </header>

      {/* Estatísticas do Curso */}
      {stats && (
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total de Módulos</p>
                  <h3 className="text-xl font-bold text-white">{stats.totalModules}</h3>
                </div>
                <BookOpen className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total de Aulas</p>
                  <h3 className="text-xl font-bold text-white">{stats.totalLessons}</h3>
                </div>
                <PlayCircle className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Duração Total</p>
                  <h3 className="text-xl font-bold text-white">{stats.totalDuration}</h3>
                </div>
                <Clock className="h-8 w-8 text-purple-400" />
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Taxa de Conclusão</p>
                  <h3 className="text-xl font-bold text-white">{stats.completionRate}%</h3>
                </div>
                <BarChart className="h-8 w-8 text-orange-400" />
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
              <h2 className="text-xl font-bold text-white flex items-center">
                <BookOpen className="mr-2" />
                Módulos do Curso
              </h2>
              <button
                onClick={() => setShowNewModuleForm(true)}
                className="text-blue-400 hover:text-blue-300"
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
                  className={`p-4 rounded-lg border transition-colors cursor-pointer
                    ${activeModuleId === module.id 
                      ? 'bg-blue-600 border-blue-500' 
                      : 'bg-gray-800 border-gray-700 hover:border-blue-500'
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
                      <button className="text-gray-400 hover:text-white">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-400">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
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
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
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
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  rows={3}
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewModuleForm(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
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
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
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
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ID do Vídeo
                </label>
                <input
                  type="text"
                  value={newLessonData.videoId}
                  onChange={(e) => setNewLessonData({ ...newLessonData, videoId: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duração
                </label>
                <input
                  type="text"
                  value={newLessonData.duration}
                  onChange={(e) => setNewLessonData({ ...newLessonData, duration: e.target.value })}
                  placeholder="Ex: 10:30"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewLessonForm(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Criar Aula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 