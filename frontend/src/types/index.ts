// Core types for the Modern Django Template// Core types for the example_project skill tree learning platform



export interface User {import { OutputData } from '@editorjs/editorjs';

  id: string;

  email: string;export interface User {

  username: string;  id: string;

  firstName?: string;  email: string;

  lastName?: string;  name: string;

  avatar?: string;  avatar?: string;

  isActive: boolean;  totalXp?: number;

  dateJoined: Date;  joinedAt?: Date;

  lastLogin?: Date;  createdAt: Date;

  createdAt: Date;  updatedAt: Date;

  updatedAt: Date;  role?: string;

}}



export interface AuthTokens {export interface SkillTree {

  access: string;  id: string;

  refresh: string;  title: string;

}  slug: string;

  description: string;

export interface LoginCredentials {  providerId: string;

  username: string;  provider: User;

  password: string;  courses: Course[];

}  coursesCount?: number;

  isPublished: boolean;

export interface RegisterData {  difficulty: 'beginner' | 'intermediate' | 'advanced';

  username: string;  estimatedTime: number; // in minutes

  email: string;  tags: string[];

  password: string;  createdAt: Date;

  firstName?: string;  updatedAt: Date;

  lastName?: string;}

}

export interface Course {

export interface UserProfile extends User {  id: string;

  bio?: string;  title: string;

  location?: string;  slug: string;

  website?: string;  description: OutputData; // Rich text content

  socialLinks?: {  content: string;

    github?: string;  skillTreeId: string;

    twitter?: string;  position: {

    linkedin?: string;    x: number;

  };    y: number;

}  };

  prerequisites: string[]; // Array of course IDs

export interface ApiError {  estimatedTime: number; // in minutes

  message: string;  difficulty: 'beginner' | 'intermediate' | 'advanced';

  code?: string;  type: 'video' | 'text' | 'quiz' | 'interactive';

  details?: Record<string, string[]>;  resources: CourseResource[];

}  chapters: Chapter[];

  createdAt: Date;

export interface PaginatedResponse<T> {  updatedAt: Date;

  count: number;}

  next: string | null;

  previous: string | null;export interface Chapter {

  results: T[];  id: string;

}  title: string;

  description?: string;

export interface FileUpload {  courseId: string;

  id: string;  chapterType:

  filename: string;    | 'content_blocks'

  size: number;    | 'video'

  contentType: string;    | 'external_link'

  url: string;    | 'external_embed'

  createdAt: Date;    | 'quiz';

  updatedAt: Date;  order: number;

}

  // Content based on type

// Example entity types - customize for your use case  content?: object; // Rich text content for content_blocks type

export interface Post {  videoUrl?: string; // For video type

  id: string;  videoDuration?: number; // in seconds

  title: string;  externalUrl?: string; // For external_link type

  content: string;  embedCode?: string; // For external_embed type

  author: User;  embedUrl?: string; // For external_embed type

  createdAt: Date;  quizData?: object; // Quiz questions and answers for quiz type

  updatedAt: Date;

  isPublished: boolean;  estimatedDuration?: number; // in minutes

}  isRequired: boolean;

  isLocked: boolean;

export interface Comment {  status: 'draft' | 'published' | 'archived';

  id: string;  viewCount: number;

  content: string;  completionCount: number;

  author: User;  contentPreview?: string;

  postId: string;  createdAt: Date;

  createdAt: Date;  updatedAt: Date;

  updatedAt: Date;}

}

export interface CourseResource {
  id: string;
  title: string;
  type: 'link' | 'file' | 'video' | 'image';
  url: string;
  description?: string;
}

export interface Progress {
  id: string;
  userId: string;
  courseId: string;
  skillTreeId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score?: number; // 0-100
  completedAt?: Date;
  timeSpent: number; // in minutes
  attempts: number;
  chapterProgress: ChapterProgress[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChapterProgress {
  id: string;
  userId: string;
  chapterId: string;
  courseProgressId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  completionPercentage: number; // 0-100
  timeSpent: number; // in minutes
  sessionStart?: Date;
  lastPosition?: object; // JSON data for position tracking

  // Quiz-specific fields
  quizScore?: number;
  quizAttempts: number;
  quizData?: object;

  // Interaction tracking
  interactions: ChapterInteraction[];

  startedAt?: Date;
  completedAt?: Date;
  lastAccessed: Date;
  notes?: string;
  bookmarks: object[];
}

export interface ChapterInteraction {
  type: string;
  timestamp: Date;
  data?: object;
}

export interface LearningSession {
  id: string;
  userId: string;
  chapterId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in seconds
  interactions: ChapterInteraction[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: string; // JSON string describing the condition
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  achievement: Achievement;
  unlockedAt: Date;
}

export interface UserStats {
  userId: string;
  totalCoursesCompleted: number;
  totalSkillTreesCompleted: number;
  totalTimeSpent: number; // in minutes
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  averageScore: number;
  achievements: UserAchievement[];
}

// UI and Component types
export interface SkillTreeNode {
  id: string;
  course: Course;
  isUnlocked: boolean;
  isCompleted: boolean;
  progress: Progress | null;
  connections: string[]; // Connected course IDs
}

export interface CourseFormData {
  title: string;
  description: string;
  content: string;
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'video' | 'text' | 'quiz' | 'interactive';
  prerequisites: string[];
  position: {
    x: number;
    y: number;
  };
  resources: Omit<CourseResource, 'id'>[];
}

export interface SkillTreeFormData {
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  tags: string[];
}
