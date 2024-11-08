import type { Course, Module, Lesson } from '@/types/course';

const API_URL = 'https://cursos-api-cursos.dpbdp1.easypanel.host';

console.log('API_URL:', API_URL); // Debug log

interface CreateCourseData {
  title: string;
  description?: string;
  thumbnailUrl?: string;
  coverUrl?: string;
}

interface CreateModuleData {
  courseId: number;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  coverUrl?: string;
  order: number;
}

interface CreateLessonData {
  moduleId: number;
  title: string;
  content?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  materialUrl?: string;
  order: number;
}

export const api = {
  courses: {
    // Listar todos os cursos
    list: async () => {
      try {
        console.log('Fazendo requisição para:', `${API_URL}/courses`);
        const response = await fetch(`${API_URL}/courses`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        console.log('Status da resposta:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Dados recebidos:', data);
        return data;
      } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
      }
    },

    // Buscar um curso específico
    get: async (id: number) => {
      const response = await fetch(`${API_URL}/courses/${id}`);
      if (!response.ok) throw new Error('Falha ao buscar curso');
      return response.json();
    },

    // Criar um novo curso
    create: async (data: CreateCourseData) => {
      const response = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Falha ao criar curso');
      return response.json();
    },

    // Atualizar um curso
    update: async (id: number, data: Partial<CreateCourseData>) => {
      const response = await fetch(`${API_URL}/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Falha ao atualizar curso');
      return response.json();
    },

    // Deletar um curso
    delete: async (id: number) => {
      const response = await fetch(`${API_URL}/courses/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Falha ao deletar curso');
    }
  },

  modules: {
    // Listar todos os módulos
    list: async () => {
      const response = await fetch(`${API_URL}/modules`);
      if (!response.ok) throw new Error('Falha ao listar módulos');
      return response.json();
    },

    // Buscar um módulo específico
    get: async (id: number) => {
      const response = await fetch(`${API_URL}/modules/${id}`);
      if (!response.ok) throw new Error('Falha ao buscar módulo');
      return response.json();
    },

    // Criar um novo módulo
    create: async (data: CreateModuleData) => {
      const response = await fetch(`${API_URL}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Falha ao criar módulo');
      return response.json();
    },

    // Atualizar um módulo
    update: async (id: number, data: Partial<CreateModuleData>) => {
      const response = await fetch(`${API_URL}/modules/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Falha ao atualizar módulo');
      return response.json();
    },

    // Deletar um módulo
    delete: async (id: number) => {
      const response = await fetch(`${API_URL}/modules/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Falha ao deletar módulo');
    }
  },

  lessons: {
    // Listar todas as aulas
    list: async () => {
      const response = await fetch(`${API_URL}/lessons`);
      if (!response.ok) throw new Error('Falha ao listar aulas');
      return response.json();
    },

    // Buscar uma aula específica
    get: async (id: number) => {
      const response = await fetch(`${API_URL}/lessons/${id}`);
      if (!response.ok) throw new Error('Falha ao buscar aula');
      return response.json();
    },

    // Criar uma nova aula
    create: async (data: CreateLessonData) => {
      const response = await fetch(`${API_URL}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Falha ao criar aula');
      return response.json();
    },

    // Atualizar uma aula
    update: async (id: number, data: Partial<CreateLessonData>) => {
      const response = await fetch(`${API_URL}/lessons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Falha ao atualizar aula');
      return response.json();
    },

    // Deletar uma aula
    delete: async (id: number) => {
      const response = await fetch(`${API_URL}/lessons/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Falha ao deletar aula');
    }
  }
}; 