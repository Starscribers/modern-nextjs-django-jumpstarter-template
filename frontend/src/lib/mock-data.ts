import {
  User,
  SkillTree,
  Course,
  Progress,
  Achievement,
  UserAchievement,
  UserStats,
} from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.learner@example.com',
    name: 'John Doe',
    role: 'learner',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    totalXp: 2450,
    joinedAt: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    email: 'jane.provider@example.com',
    name: 'Jane Smith',
    role: 'provider',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b48e5b3b?w=150&h=150&fit=crop&crop=face',
    joinedAt: new Date('2024-01-10'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    email: 'alex.learner@example.com',
    name: 'Alex Johnson',
    role: 'learner',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    totalXp: 1200,
    joinedAt: new Date('2024-01-20'),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
];

// Mock Courses
export const mockCourses: Course[] = [
  {
    id: 'course-1',
    slug: 'introduction-to-react',
    title: 'Introduction to React',
    description: {
      time: Date.now(),
      blocks: [
        {
          type: 'paragraph',
          data: {
            text: 'Learn the basics of React and component-based architecture'
          }
        }
      ],
      version: '2.28.2'
    },
    content:
      '# Introduction to React\n\nReact is a JavaScript library for building user interfaces...',
    skillTreeId: 'tree-1',
    position: { x: 100, y: 100 },
    prerequisites: [],
    estimatedTime: 30,
    difficulty: 'beginner',
    type: 'text',
    resources: [
      {
        id: 'resource-1',
        title: 'React Official Documentation',
        type: 'link',
        url: 'https://react.dev',
        description: 'Official React documentation',
      },
    ],
    chapters: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'course-2',
    slug: 'components-and-props',
    title: 'Components and Props',
    description: {
      time: Date.now(),
      blocks: [
        {
          type: 'paragraph',
          data: {
            text: 'Understanding React components and how to pass data with props'
          }
        }
      ],
      version: '2.28.2'
    },
    content:
      '# Components and Props\n\nComponents are the building blocks of React applications...',
    skillTreeId: 'tree-1',
    position: { x: 200, y: 200 },
    prerequisites: ['course-1'],
    estimatedTime: 45,
    difficulty: 'beginner',
    type: 'video',
    resources: [],
    chapters: [],
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: 'course-3',
    slug: 'state-management',
    title: 'State Management',
    description: {
      time: Date.now(),
      blocks: [
        {
          type: 'paragraph',
          data: {
            text: 'Learn how to manage component state in React'
          }
        }
      ],
      version: '2.28.2'
    },
    content:
      '# State Management\n\nState allows components to create and manage their own data...',
    skillTreeId: 'tree-1',
    position: { x: 300, y: 150 },
    prerequisites: ['course-2'],
    estimatedTime: 60,
    difficulty: 'intermediate',
    type: 'interactive',
    resources: [],
    chapters: [],
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: 'course-4',
    slug: 'react-hooks',
    title: 'React Hooks',
    description: {
      time: Date.now(),
      blocks: [
        {
          type: 'paragraph',
          data: {
            text: 'Master the power of React Hooks for state and side effects'
          }
        }
      ],
      version: '2.28.2'
    },
    content:
      '# React Hooks\n\nHooks are functions that let you hook into React state...',
    skillTreeId: 'tree-1',
    position: { x: 400, y: 100 },
    prerequisites: ['course-3'],
    estimatedTime: 75,
    difficulty: 'intermediate',
    type: 'quiz',
    resources: [],
    chapters: [],
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },
];

// Mock Skill Trees
export const mockSkillTrees: SkillTree[] = [
  {
    id: 'tree-1',
    slug: 'react-fundamentals',
    title: 'React Fundamentals',
    description: 'Master the fundamentals of React development',
    providerId: '2',
    provider: mockUsers[1],
    courses: mockCourses,
    isPublished: true,
    difficulty: 'beginner',
    estimatedTime: 210,
    tags: ['react', 'javascript', 'frontend', 'web-development'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: 'tree-2',
    slug: 'advanced-typescript',
    title: 'Advanced TypeScript',
    description: 'Deep dive into advanced TypeScript patterns and techniques',
    providerId: '2',
    provider: mockUsers[1],
    courses: [],
    isPublished: false,
    difficulty: 'advanced',
    estimatedTime: 480,
    tags: ['typescript', 'javascript', 'types', 'advanced'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
];

// Mock Progress
export const mockProgress: Progress[] = [
  {
    id: 'progress-1',
    userId: '1',
    courseId: 'course-1',
    skillTreeId: 'tree-1',
    status: 'completed',
    score: 95,
    completedAt: new Date('2024-01-21'),
    timeSpent: 28,
    attempts: 1,
    chapterProgress: [],
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-21'),
  },
  {
    id: 'progress-2',
    userId: '1',
    courseId: 'course-2',
    skillTreeId: 'tree-1',
    status: 'in_progress',
    timeSpent: 15,
    attempts: 1,
    chapterProgress: [],
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
  },
  {
    id: 'progress-3',
    userId: '3',
    courseId: 'course-1',
    skillTreeId: 'tree-1',
    status: 'completed',
    score: 88,
    completedAt: new Date('2024-01-23'),
    timeSpent: 35,
    attempts: 2,
    chapterProgress: [],
    createdAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-23'),
  },
];

// Mock Achievements
export const mockAchievements: Achievement[] = [
  {
    id: 'achievement-1',
    title: 'First Steps',
    description: 'Complete your first course',
    icon: '',
    condition: 'complete_first_course',
    points: 10,
    rarity: 'common',
  },
  {
    id: 'achievement-2',
    title: 'Tree Master',
    description: 'Complete an entire skill tree',
    icon: '🌳',
    condition: 'complete_skill_tree',
    points: 100,
    rarity: 'rare',
  },
  {
    id: 'achievement-3',
    title: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    condition: 'streak_7_days',
    points: 50,
    rarity: 'epic',
  },
  {
    id: 'achievement-4',
    title: 'Perfectionist',
    description: 'Score 100% on 10 different courses',
    icon: '💎',
    condition: 'perfect_score_10_courses',
    points: 200,
    rarity: 'legendary',
  },
];

// Mock User Achievements
export const mockUserAchievements: UserAchievement[] = [
  {
    id: 'user-achievement-1',
    userId: '1',
    achievementId: 'achievement-1',
    achievement: mockAchievements[0],
    unlockedAt: new Date('2024-01-21'),
  },
  {
    id: 'user-achievement-2',
    userId: '1',
    achievementId: 'achievement-3',
    achievement: mockAchievements[2],
    unlockedAt: new Date('2024-01-28'),
  },
];

// Mock User Stats
export const mockUserStats: UserStats[] = [
  {
    userId: '1',
    totalCoursesCompleted: 15,
    totalSkillTreesCompleted: 2,
    totalTimeSpent: 420,
    totalPoints: 350,
    currentStreak: 7,
    longestStreak: 12,
    averageScore: 92.5,
    achievements: mockUserAchievements.filter(ua => ua.userId === '1'),
  },
  {
    userId: '3',
    totalCoursesCompleted: 3,
    totalSkillTreesCompleted: 0,
    totalTimeSpent: 95,
    totalPoints: 45,
    currentStreak: 2,
    longestStreak: 3,
    averageScore: 85.0,
    achievements: [],
  },
];

// Helper functions for working with mock data
export function getUserById(id: string): User | undefined {
  return mockUsers.find(user => user.id === id);
}

export function getSkillTreeById(id: string): SkillTree | undefined {
  return mockSkillTrees.find(tree => tree.id === id);
}

export function getCourseById(id: string): Course | undefined {
  return mockCourses.find(course => course.id === id);
}

export function getProgressByUser(userId: string): Progress[] {
  return mockProgress.filter(progress => progress.userId === userId);
}

export function getProgressForCourse(
  userId: string,
  courseId: string
): Progress | undefined {
  return mockProgress.find(
    progress => progress.userId === userId && progress.courseId === courseId
  );
}

export function getUserStats(userId: string): UserStats | undefined {
  return mockUserStats.find(stats => stats.userId === userId);
}
