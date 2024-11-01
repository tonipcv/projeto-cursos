'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Trash2 } from 'lucide-react';

interface Module {
  id: string;
  title: string;
  description: string;
  courseTitle: string;
}

interface ModuleListProps {
  onUpdate: () => void;
}

export default function ModuleList({ onUpdate }: ModuleListProps) {
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await fetch('/api/modules');
      const data = await response.json();
      setModules(data);
    } catch (error: any) {
      console.error('Erro ao buscar módulos:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/modules/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchModules();
        onUpdate();
      }
    } catch (error: any) {
      console.error('Erro ao deletar módulo:', error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Layout className="h-6 w-6 text-indigo-500" />
        Lista de Módulos
      </h2>
      <div className="space-y-4">
        {modules.map((module: Module) => (
          <div
            key={module.id}
            className="bg-gray-800 p-4 rounded-lg border border-gray-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-white">{module.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{module.description}</p>
                <p className="text-xs text-indigo-400 mt-2">Curso: {module.courseTitle}</p>
              </div>
              <button
                onClick={() => handleDelete(module.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
        {modules.length === 0 && (
          <p className="text-gray-400 text-center">Nenhum módulo encontrado</p>
        )}
      </div>
    </div>
  );
} 