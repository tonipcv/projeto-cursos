export interface Course {
  id: string;
  title: string;
  description: string;
  modulesCount: number;
  lessonsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  courseId: string;
  order: number;
  course?: Course;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoId: string | null;
  embedUrl: string | null;
  videoType: string | null;
  thumbnail: string | null;
  duration: string | null;
  order: number;
  moduleId: string;
  module?: Module;
} 