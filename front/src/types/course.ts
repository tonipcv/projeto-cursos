export interface Course {
  id: number;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  coverUrl: string | null;
  modules: Module[];
  modulesCount?: number;
  lessonsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateModuleData {
  courseId: number;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  coverUrl?: string | null;
  order: number;
}

export interface Module {
  id: number;
  courseId: number;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  coverUrl: string | null;
  order: number;
  lessons: Lesson[];
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: number;
  moduleId: number;
  title: string;
  content: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  materialUrl: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
} 