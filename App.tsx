import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { TaskList } from './components/TaskList';
import { TaskModal } from './components/TaskModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { AuthModal } from './components/AuthModal';
import { ApiService } from './services/apiService';
import { DayOneAgent } from './services/aiAgent';
import { Task, TaskFilter, User } from './types';
import { Loader2, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [agentAdvice, setAgentAdvice] = useState<string>('');
  
  const [view, setView] = useState<'dashboard' | 'tasks'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [confirmConfig, setConfirmConfig] = useState<any>(null);
  const [filter, setFilter] = useState<TaskFilter>({ status: 'all' });
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  // Handle Dark Mode DOM manipulation
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const checkAuth = async () => {
    const currentUser = await ApiService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  };

  const loadData = async () => {
    try {
      const data = await ApiService.getTasks();
      setTasks(data);
      // Backend AI Agent Strategic Planning
      const advice = await DayOneAgent.getStrategicAdvice(data);
      setAgentAdvice(advice);
    } catch (e) {
      console.error(e);
    }
  };

  const handleViewTasks = (newFilter?: TaskFilter) => {
    if (newFilter) {
      setFilter(prev => ({ ...prev, ...newFilter }));
    }
    setView('tasks');
  };

  const handleUpdateTask = (task: Task) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Confirm Changes',
      message: 'Save updates to backend?',
      confirmLabel: 'Sync Now',
      variant: 'info',
      onConfirm: async () => {
        await ApiService.saveTask(task);
        await loadData();
        setIsModalOpen(false);
        setEditingTask(undefined);
        setConfirmConfig(null);
      }
    });
  };

  const handleDeleteTask = (id: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Task',
      message: 'This will permanently remove the task from our servers.',
      confirmLabel: 'Delete',
      variant: 'danger',
      onConfirm: async () => {
        await ApiService.deleteTask(id);
        await loadData();
        setConfirmConfig(null);
      }
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
    </div>
  );

  if (!user) return <AuthModal onLogin={setUser} />;

  return (
    <Layout
      currentView={view}
      onNavigate={setView}
      onAddClick={() => { setEditingTask(undefined); setIsModalOpen(true); }}
      isDarkMode={darkMode}
      onToggleDarkMode={() => setDarkMode(!darkMode)}
      user={user}
    >
      {/* AI Agent Advice Banner */}
      {view === 'dashboard' && agentAdvice && (
        <div className="mb-6 bg-indigo-600/10 dark:bg-indigo-400/10 border border-indigo-200 dark:border-indigo-800 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">DayOne Agent Advice</p>
            <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">{agentAdvice}</p>
          </div>
        </div>
      )}

      {view === 'dashboard' ? (
        <Dashboard tasks={tasks} onViewTasks={handleViewTasks} isDarkMode={darkMode} />
      ) : (
        <TaskList
          tasks={tasks}
          filter={filter}
          onFilterChange={setFilter}
          onEdit={(t) => { setEditingTask(t); setIsModalOpen(true); }}
          onDelete={handleDeleteTask}
          onToggleComplete={async (t) => { await ApiService.saveTask({...t, isCompleted: !t.isCompleted}); loadData(); }}
          onUpdateTask={handleUpdateTask}
        />
      )}

      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={async (t) => { await ApiService.saveTask(t); loadData(); setIsModalOpen(false); }}
          initialData={editingTask}
        />
      )}

      {confirmConfig && (
        <ConfirmationModal {...confirmConfig} onCancel={() => setConfirmConfig(null)} />
      )}
    </Layout>
  );
};

export default App;