'use client';

import { useState, useEffect } from 'react';
import AddCourseForm from '@/components/admin/AddCourseForm';
import CourseList from '@/components/admin/CourseList';
import AddModuleForm from '@/components/admin/AddModuleForm';
import ModuleList from '@/components/admin/ModuleList';
import AddLessonForm from '@/components/admin/AddLessonForm';
import LessonList from '@/components/admin/LessonList';
import { 
  BookOpen, 
  Layout, 
  Video,
  BookOpenCheck,
  Menu,
  Moon,
  Sun
} from 'lucide-react';

interface Stats {
  totalCourses: number;
  totalModules: number;
  totalLessons: number;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('courses');
  const [stats, setStats] = useState<Stats>({
    totalCourses: 0,
    totalModules: 0,
    totalLessons: 0
  });
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const handleUpdate = async () => {
    await fetchStats();
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    setMounted(true);
    fetchStats();
    document.documentElement.classList.add('dark');
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-gray-400 hover:text-gray-300 mr-4"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                <BookOpenCheck className="h-6 w-6 md:h-8 md:w-8 text-indigo-500" />
                <span className="hidden md:inline">Plataforma de Cursos</span>
                <span className="md:hidden">Cursos</span>
              </h1>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              {isDarkMode ? 
                <Sun className="h-5 w-5 text-yellow-500" /> : 
                <Moon className="h-5 w-5 text-gray-400" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-gray-900 border-b border-gray-800`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {['courses', 'modules', 'lessons'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setIsMobileMenuOpen(false);
              }}
              className={`${
                activeTab === tab
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              } block w-full px-3 py-2 rounded-md text-base font-medium capitalize`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Desktop Tabs */}
        <div className="hidden md:block border-b border-gray-800">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('courses')}
              className={`${
                activeTab === 'courses'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
              } flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              <BookOpen className="h-5 w-5" />
              Cursos
            </button>
            <button
              onClick={() => setActiveTab('modules')}
              className={`${
                activeTab === 'modules'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
              } flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              <Layout className="h-5 w-5" />
              Módulos
            </button>
            <button
              onClick={() => setActiveTab('lessons')}
              className={`${
                activeTab === 'lessons'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
              } flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              <Video className="h-5 w-5" />
              Aulas
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="mt-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="bg-gray-900 overflow-hidden shadow-lg rounded-lg border border-gray-800">
              <div className="p-4 sm:p-6">
                {activeTab === 'courses' && (
                  <AddCourseForm onCourseAdded={handleUpdate} />
                )}
                {activeTab === 'modules' && (
                  <AddModuleForm onModuleAdded={handleUpdate} />
                )}
                {activeTab === 'lessons' && (
                  <AddLessonForm onLessonAdded={handleUpdate} />
                )}
              </div>
            </div>

            <div className="bg-gray-900 overflow-hidden shadow-lg rounded-lg border border-gray-800">
              <div className="p-4 sm:p-6">
                {activeTab === 'courses' && (
                  <CourseList onUpdate={handleUpdate} />
                )}
                {activeTab === 'modules' && (
                  <ModuleList onUpdate={handleUpdate} />
                )}
                {activeTab === 'lessons' && (
                  <LessonList onUpdate={handleUpdate} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-8">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="px-4 py-5 bg-gray-900 shadow-lg rounded-lg overflow-hidden sm:p-6 border border-gray-800">
              <dt className="text-sm font-medium text-gray-400 truncate flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-500" />
                Total Cursos
              </dt>
              <dd className="mt-1 text-2xl sm:text-3xl font-semibold text-white">{stats.totalCourses}</dd>
            </div>
            <div className="px-4 py-5 bg-gray-900 shadow-lg rounded-lg overflow-hidden sm:p-6 border border-gray-800">
              <dt className="text-sm font-medium text-gray-400 truncate flex items-center gap-2">
                <Layout className="h-5 w-5 text-indigo-500" />
                Total Módulos
              </dt>
              <dd className="mt-1 text-2xl sm:text-3xl font-semibold text-white">{stats.totalModules}</dd>
            </div>
            <div className="px-4 py-5 bg-gray-900 shadow-lg rounded-lg overflow-hidden sm:p-6 border border-gray-800 sm:col-span-2 lg:col-span-1">
              <dt className="text-sm font-medium text-gray-400 truncate flex items-center gap-2">
                <Video className="h-5 w-5 text-indigo-500" />
                Total Aulas
              </dt>
              <dd className="mt-1 text-2xl sm:text-3xl font-semibold text-white">{stats.totalLessons}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
