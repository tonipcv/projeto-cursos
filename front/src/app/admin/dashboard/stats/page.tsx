'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart as BarChartIcon, 
  BookOpen, 
  Layout, 
  PlayCircle,
  TrendingUp,
  Clock,
  Users,
  Calendar,
  Activity,
  PieChart,
  LineChart
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface Stats {
  totalCourses: number;
  totalModules: number;
  totalLessons: number;
  averageLessonsPerModule: number;
  averageModulesPerCourse: number;
  coursesPerMonth: {
    month: string;
    count: number;
  }[];
  modulesPerCourse: {
    courseName: string;
    moduleCount: number;
  }[];
}

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (!response.ok) throw new Error('Falha ao carregar estatísticas');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !stats) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-white">Carregando estatísticas...</span>
        </div>
      </div>
    );
  }

  // Dados para o gráfico de pizza
  const distributionData = [
    { name: 'Cursos', value: stats.totalCourses },
    { name: 'Módulos', value: stats.totalModules },
    { name: 'Aulas', value: stats.totalLessons }
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Activity className="mr-2" />
            Dashboard de Estatísticas
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedTimeRange('week')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedTimeRange === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setSelectedTimeRange('month')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedTimeRange === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Mês
            </button>
            <button
              onClick={() => setSelectedTimeRange('year')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedTimeRange === 'year'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Ano
            </button>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total de Cursos</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stats.totalCourses}</h3>
                <p className="text-green-400 text-sm mt-2">↑ 12% desde o último mês</p>
              </div>
              <div className="bg-blue-900 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total de Módulos</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stats.totalModules}</h3>
                <p className="text-green-400 text-sm mt-2">↑ 8% desde o último mês</p>
              </div>
              <div className="bg-purple-900 p-3 rounded-lg">
                <Layout className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green-500 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total de Aulas</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stats.totalLessons}</h3>
                <p className="text-green-400 text-sm mt-2">↑ 15% desde o último mês</p>
              </div>
              <div className="bg-green-900 p-3 rounded-lg">
                <PlayCircle className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-orange-500 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Média de Aulas/Módulo</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {stats.averageLessonsPerModule.toFixed(1)}
                </h3>
                <p className="text-orange-400 text-sm mt-2">↔ Estável</p>
              </div>
              <div className="bg-orange-900 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Gráfico de Linha - Crescimento */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <LineChart className="mr-2 h-5 w-5" />
              Crescimento ao Longo do Tempo
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={stats.coursesPerMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: '#fff'
                    }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico de Pizza - Distribuição */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <PieChart className="mr-2 h-5 w-5" />
              Distribuição de Conteúdo
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: '#fff'
                    }}
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Gráfico de Barras - Módulos por Curso */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <BarChartIcon className="mr-2 h-5 w-5" />
            Módulos por Curso
          </h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.modulesPerCourse} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis 
                  dataKey="courseName" 
                  type="category" 
                  stroke="#9CA3AF" 
                  width={150}
                  tick={{ fill: '#9CA3AF' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#fff'
                  }}
                />
                <Bar 
                  dataKey="moduleCount" 
                  fill="#8B5CF6"
                  radius={[0, 4, 4, 0]}
                  label={{ position: 'right', fill: '#fff' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 