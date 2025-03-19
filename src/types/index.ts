export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
  };
  thumbnail: string;
  price: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  rating: number;
  enrolledStudents: number;
  chapters: Chapter[];
  features: string[];
  updatedAt: string;
}

export interface Chapter {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  resources: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'quiz';
  url: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'student' | 'instructor' | 'admin';
  enrolledCourses: string[];
  progress: Record<string, number>;
}