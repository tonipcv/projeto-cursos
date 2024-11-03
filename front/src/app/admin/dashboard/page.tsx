'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Layout, 
  PlayCircle,
  Plus,
  Settings,
  BarChart,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import type { Course } from '@/types/course';
import StatsPage from './stats/page';
import SettingsPage from './settings/page';

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('courses');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'courses':
        return <CoursesList />;
      case 'modules':
        return <ModulesList />;
      case 'lessons':
        return <LessonsList />;
      case 'stats':
        return <StatsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header Fixo com Menu */}
      <header className="fixed top-0 left-0 right-0 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 z-40">
        {/* Logo e Nome */}
        <div className="px-4 py-3 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <GraduationCap className="h-6 w-6 text-violet-500" />
              <span className="ml-2 font-bold text-white text-lg">Dashboard</span>
            </div>
            <Link 
              href="/"
              className="text-gray-300 hover:text-white text-sm flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar ao Site
            </Link>
          </div>
        </div>

        {/* Menu de Navegação Responsivo */}
        <div className="overflow-x-auto">
          <nav className="px-4 min-w-max">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('courses')}
                className={`px-4 py-3 text-sm font-medium transition-colors rounded-t-lg -mb-px flex items-center whitespace-nowrap ${
                  activeTab === 'courses'
                    ? 'text-violet-500 bg-gray-950 border-t border-l border-r border-violet-500/20'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Cursos</span>
              </button>

              <button
                onClick={() => setActiveTab('modules')}
                className={`px-4 py-3 text-sm font-medium transition-colors rounded-t-lg -mb-px flex items-center whitespace-nowrap ${
                  activeTab === 'modules'
                    ? 'text-violet-500 bg-gray-950 border-t border-l border-r border-violet-500/20'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Layout className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Módulos</span>
              </button>

              <button
                onClick={() => setActiveTab('lessons')}
                className={`px-4 py-3 text-sm font-medium transition-colors rounded-t-lg -mb-px flex items-center whitespace-nowrap ${
                  activeTab === 'lessons'
                    ? 'text-violet-500 bg-gray-950 border-t border-l border-r border-violet-500/20'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <PlayCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Aulas</span>
              </button>

              <button
                onClick={() => setActiveTab('stats')}
                className={`px-4 py-3 text-sm font-medium transition-colors rounded-t-lg -mb-px flex items-center whitespace-nowrap ${
                  activeTab === 'stats'
                    ? 'text-violet-500 bg-gray-950 border-t border-l border-r border-violet-500/20'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <BarChart className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Estatísticas</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-3 text-sm font-medium transition-colors rounded-t-lg -mb-px flex items-center whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'text-violet-500 bg-gray-950 border-t border-l border-r border-violet-500/20'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Settings className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Configurações</span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="pt-28 min-h-screen">
        <div className="px-4 md:px-6 lg:px-8">
          {/* Header do Conteúdo */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {activeTab === 'courses' && 'Gerenciar Cursos'}
              {activeTab === 'modules' && 'Gerenciar Módulos'}
              {activeTab === 'lessons' && 'Gerenciar Aulas'}
              {activeTab === 'stats' && 'Estatísticas'}
              {activeTab === 'settings' && 'Configurações'}
            </h2>
            {(activeTab === 'courses' || activeTab === 'modules' || activeTab === 'lessons') && (
              <button
                onClick={() => window.location.href = `/admin/${activeTab}/new`}
                className="flex items-center justify-center px-4 py-2 bg-violet-600/20 text-violet-500 rounded-lg hover:bg-violet-600/30 transition-all border border-violet-500/20 w-full sm:w-auto"
              >
                <Plus className="mr-2 h-5 w-5" />
                {activeTab === 'courses' && 'Novo Curso'}
                {activeTab === 'modules' && 'Novo Módulo'}
                {activeTab === 'lessons' && 'Nova Aula'}
              </button>
            )}
          </div>

          {/* Conteúdo */}
          <div className="w-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

// Componente para listar cursos
function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (!response.ok) throw new Error('Falha ao carregar cursos');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este curso?')) return;

    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Falha ao excluir curso');
      fetchCourses();
    } catch (error) {
      console.error('Erro ao excluir curso:', error);
      alert('Erro ao excluir curso. Tente novamente.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-white">Carregando cursos...</span>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-400">Nenhum curso encontrado</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4" suppressHydrationWarning>
      {courses.map((course) => (
        <div key={course.id} className="bg-gray-900 rounded-lg p-6 transition-all border border-gray-800 hover:border-violet-500/50 group">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="space-y-2 flex-1">
              <h3 className="text-lg font-semibold text-white group-hover:text-violet-500 transition-colors">
                {course.title}
              </h3>
              <p className="text-gray-400 text-sm">{course.description}</p>
              <div className="flex gap-4">
                <span className="text-sm text-gray-500">
                  {course.modulesCount} módulos
                </span>
                <span className="text-sm text-gray-500">
                  {course.lessonsCount} aulas
                </span>
              </div>
            </div>
            <div className="flex flex-row sm:flex-col md:flex-row gap-2 w-full sm:w-auto">
              <Link
                href={`/admin/courses/edit/${course.id}`}
                className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-violet-600/20 text-violet-500 rounded-lg hover:bg-violet-600/30 transition-all border border-violet-500/20"
              >
                Editar
              </Link>
              <button
                onClick={() => handleDeleteCourse(course.id)}
                className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-red-600/20 text-red-500 rounded-lg hover:bg-red-600/30 transition-all border border-red-500/20"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Componentes similares para Módulos e Aulas
function ModulesList() {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await fetch('/api/modules');
      if (!response.ok) throw new Error('Falha ao carregar módulos');
      const data = await response.json();
      // Ordenar módulos por curso e ordem
      const sortedModules = data.sort((a: any, b: any) => {
        if (a.courseId === b.courseId) {
          return a.order - b.order;
        }
        return a.courseId.localeCompare(b.courseId);
      });
      setModules(sortedModules);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleUpdateOrder = async (moduleId: string, newOrder: number) => {
    try {
      const response = await fetch(`/api/modules/${moduleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order: newOrder }),
      });

      if (!response.ok) throw new Error('Falha ao atualizar ordem');
      fetchModules();
    } catch (error) {
      console.error('Erro ao atualizar ordem:', error);
    }
  };

  const handleDeleteModule = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este módulo?')) return;

    try {
      const response = await fetch(`/api/modules/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Falha ao excluir módulo');

      fetchModules();
    } catch (error) {
      console.error('Erro ao excluir módulo:', error);
      alert('Erro ao excluir módulo. Tente novamente.');
    }
  };

  return (
    <div className="grid gap-4" suppressHydrationWarning>
      {modules.map((module: any) => (
        <div key={module.id} className="bg-gray-900 rounded-lg p-6 transition-all border border-gray-800 hover:border-violet-500/50 group">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white group-hover:text-violet-500 transition-colors">
                  {module.title}
                </h3>
                <span className="text-sm text-gray-500">
                  (Ordem: {module.order})
                </span>
              </div>
              <p className="text-gray-400 text-sm">{module.description}</p>
              <p className="text-sm text-gray-500">
                Curso: {module.course.title}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUpdateOrder(module.id, module.order - 1)}
                disabled={module.order === 0}
                className="p-2 text-gray-400 hover:text-violet-500 disabled:opacity-50"
              >
                ↑
              </button>
              <button
                onClick={() => handleUpdateOrder(module.id, module.order + 1)}
                className="p-2 text-gray-400 hover:text-violet-500"
              >
                ↓
              </button>
              <div className="flex flex-row sm:flex-col md:flex-row gap-2">
                <Link
                  href={`/admin/modules/edit/${module.id}`}
                  className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-violet-600/20 text-violet-500 rounded-lg hover:bg-violet-600/30 transition-all border border-violet-500/20"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDeleteModule(module.id)}
                  className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-red-600/20 text-red-500 rounded-lg hover:bg-red-600/30 transition-all border border-red-500/20"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LessonsList() {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await fetch('/api/lessons');
      if (!response.ok) throw new Error('Falha ao carregar aulas');
      const data = await response.json();
      // Ordenar aulas por módulo e ordem
      const sortedLessons = data.sort((a: any, b: any) => {
        if (a.moduleId === b.moduleId) {
          return a.order - b.order;
        }
        return a.moduleId.localeCompare(b.moduleId);
      });
      setLessons(sortedLessons);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleUpdateOrder = async (lessonId: string, newOrder: number) => {
    try {
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order: newOrder }),
      });

      if (!response.ok) throw new Error('Falha ao atualizar ordem');
      fetchLessons();
    } catch (error) {
      console.error('Erro ao atualizar ordem:', error);
    }
  };

  const handleDeleteLesson = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta aula?')) return;

    try {
      const response = await fetch(`/api/lessons/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Falha ao excluir aula');

      fetchLessons();
    } catch (error) {
      console.error('Erro ao excluir aula:', error);
      alert('Erro ao excluir aula. Tente novamente.');
    }
  };

  return (
    <div className="grid gap-4" suppressHydrationWarning>
      {lessons.map((lesson: any) => (
        <div key={lesson.id} className="bg-gray-900 rounded-lg p-6 transition-all border border-gray-800 hover:border-violet-500/50 group">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white group-hover:text-violet-500 transition-colors">
                  {lesson.title}
                </h3>
                <span className="text-sm text-gray-500">
                  (Ordem: {lesson.order})
                </span>
              </div>
              <p className="text-gray-400 text-sm">{lesson.description}</p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Curso: {lesson.module.course.title}</p>
                <p>Módulo: {lesson.module.title}</p>
                {lesson.duration && <p>Duração: {lesson.duration}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUpdateOrder(lesson.id, lesson.order - 1)}
                disabled={lesson.order === 0}
                className="p-2 text-gray-400 hover:text-violet-500 disabled:opacity-50"
              >
                ↑
              </button>
              <button
                onClick={() => handleUpdateOrder(lesson.id, lesson.order + 1)}
                className="p-2 text-gray-400 hover:text-violet-500"
              >
                ↓
              </button>
              <div className="flex flex-row sm:flex-col md:flex-row gap-2">
                <Link
                  href={`/admin/lessons/edit/${lesson.id}`}
                  className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-violet-600/20 text-violet-500 rounded-lg hover:bg-violet-600/30 transition-all border border-violet-500/20"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDeleteLesson(lesson.id)}
                  className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-red-600/20 text-red-500 rounded-lg hover:bg-red-600/30 transition-all border border-red-500/20"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 