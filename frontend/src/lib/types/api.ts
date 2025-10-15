// API Type Definitions based on Django backend models

import { OutputData } from '@editorjs/editorjs';

export interface ImageModel {
  id: number;
  name: string;
  description?: string;
  altText?: string;
  // Various URL fields provided by backend ImageModelSerializer
  url?: string;
  thumbnailUrl?: string;
  absoluteUrl?: string;
  absoluteThumbnailUrl?: string;
  originalImage?: string;
  optimizedImage?: string;
  thumbnail?: string;
  // Legacy/alternate field some parts of the app might expect
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SkillTree {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  status: 'draft' | 'published' | 'archived';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;
  thumbnail?: ImageModel;
  thumbnailId?: number;
  category: string;
  tags: string[];
  viewCount: number;
  enrollmentCount: number;
  completionCount: number;
  isPublic: boolean;
  isFree: boolean;
  coursesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  questionType:
    | 'multiple_choice'
    | 'true_false'
    | 'short_answer'
    | 'fill_blank';
  choices: string[];
  correctAnswers: string[];
  explanation?: string;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimit?: number;
  passingScore: number;
  maxAttempts: number;
  questions: QuizQuestion[];
}

export interface Chapter {
  id: string;
  title: string;
  slug: string;
  description: string;
  chapterType:
    | 'content_blocks'
    | 'video'
    | 'quiz'
    | 'external_link'
    | 'external_embed';
  content: object;
  videoUrl?: string;
  videoDuration?: number;
  externalUrl?: string;
  embedCode?: string;
  embedUrl?: string;
  quizData?: object;
  order: number;
  estimatedDuration: number;
  isRequired: boolean;
  isLocked: boolean;
  status: 'draft' | 'published' | 'archived';
  viewCount: number;
  completionCount: number;
  contentPreview: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Form data types for creating/updating
export interface CreateSkillTreeData {
  title: string;
  description: string;
  shortDescription: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;
  category: string;
  tags: string[];
  isPublic: boolean;
  isFree: boolean;
  thumbnailId?: number;
}

export interface UpdateSkillTreeData extends Partial<CreateSkillTreeData> {
  status?: 'draft' | 'published' | 'archived';
  // allow updating slug while draft (provider)
  slug?: string;
}

export interface CreateCourseData {
  title: string;
  description: string;
  content: string;
  courseType: 'text' | 'video' | 'quiz' | 'interactive';
  estimatedDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  order: number;
  positionX: number;
  positionY: number;
  videoUrl?: string;
  resources?: object[];
}

export interface UpdateCourseData extends Partial<CreateCourseData> {
  status?: 'draft' | 'published' | 'archived';
  // teacher assignments
  primaryTeacherId?: string | null;
  assistantTeacherIds?: string[];
}

export interface CreateChapterData {
  title: string;
  description: OutputData;
  chapterType:
    | 'content_blocks'
    | 'video'
    | 'quiz'
    | 'external_link'
    | 'external_embed';
  content: object;
  order: number;
  estimatedDuration: number;
  isRequired: boolean;
  videoUrl?: string;
  videoDuration?: number;
  externalUrl?: string;
  embedCode?: string;
  embedUrl?: string;
  quizData?: object;
}

export interface UpdateChapterData extends Partial<CreateChapterData> {
  status?: 'draft' | 'published' | 'archived';
  isLocked?: boolean;
}

// Teachers
export interface TeacherSummary {
  id: string;
  displayName: string;
  bio: string;
  isActive: boolean;
  specialties?: string[]; // provided in list for tags
  avatar?: ImageModel | null; // provided in list for avatar
}

export interface Teacher extends TeacherSummary {
  specialties: string[];
  avatar?: ImageModel | null;
  userId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeacherData {
  displayName: string;
  bio?: string;
  specialties?: string[];
  isActive?: boolean;
  avatarImageId?: number | null;
  userId?: string | null;
}
