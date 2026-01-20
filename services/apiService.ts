import { Task, User } from '../types';
import { TaskService } from './taskService';

/**
 * Production-ready API Orchestrator
 * Switch USE_REAL_BACKEND to true once you have deployed Backend.java to a server.
 */
const USE_REAL_BACKEND = false; // Set to true when your Spring Boot server is live
const API_BASE_URL = 'https://your-deployed-backend.com/api'; 

export const ApiService = {
  // Mock delay to simulate real-world API overhead
  delay: (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms)),

  getAuthHeader: () => {
    const token = localStorage.getItem('dayone_token');
    return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
  },

  getCurrentUser: async (): Promise<User | null> => {
    if (USE_REAL_BACKEND) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, { headers: ApiService.getAuthHeader() });
        if (!response.ok) return null;
        return await response.json();
      } catch (e) { return null; }
    }

    await ApiService.delay(300);
    const userStr = localStorage.getItem('dayone_user');
    const token = localStorage.getItem('dayone_token');
    if (!token) return null;
    return userStr ? JSON.parse(userStr) : null;
  },

  getTasks: async (): Promise<Task[]> => {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/tasks`, { headers: ApiService.getAuthHeader() });
      if (!response.ok) throw new Error('Unauthorized');
      return await response.json();
    }

    await ApiService.delay(700);
    const headers = ApiService.getAuthHeader() as any;
    if (!headers.Authorization) throw new Error('Unauthorized');
    
    const user = await ApiService.getCurrentUser();
    const allTasks = TaskService.getTasks();
    return allTasks.filter(t => t.userId === user?.id);
  },

  saveTask: async (task: Partial<Task>): Promise<Task> => {
    if (USE_REAL_BACKEND) {
      const method = task.id ? 'PUT' : 'POST';
      const url = task.id ? `${API_BASE_URL}/tasks/${task.id}` : `${API_BASE_URL}/tasks`;
      const response = await fetch(url, {
        method,
        headers: ApiService.getAuthHeader(),
        body: JSON.stringify(task)
      });
      return await response.json();
    }

    await ApiService.delay(800);
    const headers = ApiService.getAuthHeader() as any;
    if (!headers.Authorization) throw new Error('Unauthorized');

    const user = await ApiService.getCurrentUser();
    if (!user) throw new Error('Session Expired');

    if (task.id) {
      return TaskService.updateTask(task as Task);
    } else {
      return TaskService.createTask({ ...task, userId: user.id } as any);
    }
  },

  deleteTask: async (id: string): Promise<void> => {
    if (USE_REAL_BACKEND) {
      await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: ApiService.getAuthHeader()
      });
      return;
    }

    await ApiService.delay(500);
    const headers = ApiService.getAuthHeader() as any;
    if (!headers.Authorization) throw new Error('Unauthorized');
    TaskService.deleteTask(id);
  }
};