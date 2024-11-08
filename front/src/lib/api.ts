import { Course, Module, Lesson } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = {
  courses: {
    list: () => fetch(`${API_BASE_URL}/courses`).then(res => res.json()) as Promise<Course[]>,
    get: (id: number) => fetch(`${API_BASE_URL}/courses/${id}`).then(res => res.json()) as Promise<Course>,
    create: (data: Partial<Course>) => fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()) as Promise<Course>,
    update: (id: number, data: Partial<Course>) => fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()) as Promise<Course>,
    delete: (id: number) => fetch(`${API_BASE_URL}/courses/${id}`, { method: 'DELETE' })
  },
  modules: {
    create: (data: Partial<Module>) => fetch(`${API_BASE_URL}/modules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()) as Promise<Module>,
    update: (id: number, data: Partial<Module>) => fetch(`${API_BASE_URL}/modules/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()) as Promise<Module>,
    delete: (id: number) => fetch(`${API_BASE_URL}/modules/${id}`, { method: 'DELETE' })
  },
  lessons: {
    create: (data: Partial<Lesson>) => fetch(`${API_BASE_URL}/lessons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()) as Promise<Lesson>,
    update: (id: number, data: Partial<Lesson>) => fetch(`${API_BASE_URL}/lessons/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()) as Promise<Lesson>,
    delete: (id: number) => fetch(`${API_BASE_URL}/lessons/${id}`, { method: 'DELETE' })
  }
}; 