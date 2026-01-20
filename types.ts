export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum Category {
  WORK = 'WORK',
  PERSONAL = 'PERSONAL',
  LEARNING = 'LEARNING',
  HEALTH = 'HEALTH',
  FINANCE = 'FINANCE',
  OTHER = 'OTHER'
}

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: Priority;
  category: Category;
  isCompleted: boolean;
  subtasks: Subtask[];
  createdAt: number;
  updatedAt: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface TaskFilter {
  status: 'all' | 'completed' | 'pending';
  priority?: Priority;
  category?: Category;
  search?: string;
}

export const PRIORITY_COLORS: Record<Priority, string> = {
  [Priority.LOW]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [Priority.MEDIUM]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [Priority.HIGH]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  [Priority.URGENT]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.WORK]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  [Category.PERSONAL]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [Category.LEARNING]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  [Category.HEALTH]: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
  [Category.FINANCE]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  [Category.OTHER]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};