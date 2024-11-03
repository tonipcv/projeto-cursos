'use client';

import { useEffect, useState } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  PlayCircle, 
  Plus,
  Search
} from 'lucide-react';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  description: string;
  modulesCount?: number;
  lessonsCount?: number;
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        if (!response.ok) throw new Error('Falha ao carregar cursos');
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar cursos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-900">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
          <span className="ml-2 text-gray-400">Carregando cursos...</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-900">
        <div className="text-gray-400 flex items-center justify-center h-screen">
          <span className="mr-2">⚠️</span> {error}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Header com navegação */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <GraduationCap className="mr-2 text-violet-500" />
              EduPlataforma
            </h1>
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Buscar cursos..."
                className="pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 text-gray-200 border border-gray-800 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 w-[300px] placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <Link 
            href="/admin/dashboard" 
            className="flex items-center px-4 py-2 bg-violet-600/20 text-violet-500 rounded-lg hover:bg-violet-600/30 transition-all border border-violet-500/20"
          >
            <Plus className="mr-2 h-5 w-5" />
            Área Administrativa
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        {/* Lista de Cursos */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <BookOpen className="mr-2 text-violet-500" />
              Cursos Disponíveis
            </h2>
            <button className="text-violet-500 hover:text-violet-400 text-sm">
              Ver todos
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses
              .filter(course => 
                course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.description.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((course: Course) => (
              <div 
                key={course.id} 
                className="bg-gray-900 rounded-lg p-6 transition-all border border-gray-800 hover:border-violet-500/50 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-xl text-white group-hover:text-violet-500 transition-colors">
                    {course.title}
                  </h3>
                  <span className="bg-violet-600/10 text-violet-500 text-xs px-2 py-1 rounded-full border border-violet-500/20">
                    {course.modulesCount || 0} módulos
                  </span>
                </div>
                <p className="text-gray-400 mb-6 line-clamp-2">{course.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {course.lessonsCount || 0} aulas
                  </span>
                  <Link 
                    href={`/courses/${course.id}`}
                    className="flex items-center px-4 py-2 bg-violet-600/20 text-violet-500 rounded-lg hover:bg-violet-600/30 transition-all border border-violet-500/20"
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Começar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
