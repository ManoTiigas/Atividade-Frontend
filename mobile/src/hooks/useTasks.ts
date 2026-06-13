// src/hooks/useTasks.ts
//
// Custom hook que encapsula toda a lógica de estado das tarefas.
// Componentes só consomem dados e chamam handlers — sem lógica de fetch inline.

import { useState, useCallback, useEffect } from 'react';
import { Task, TaskStats } from '../types/Task';
import { taskApi, ApiError } from '../services/api';

interface UseTasksReturn {
  tasks: Task[];
  stats: TaskStats;
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  deleteTask: (id: string) => Promise<boolean>;
}

const DEFAULT_STATS: TaskStats = { pending: 0, in_progress: 0, done: 0, total: 0 };

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Paralelismo: busca lista e stats ao mesmo tempo
      const [tasksRes, statsRes] = await Promise.all([
        taskApi.getAll(),
        taskApi.getStats(),
      ]);

      setTasks(tasksRes.data);
      setStats(statsRes.data);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erro ao carregar tarefas';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    try {
      await taskApi.delete(id);
      // Atualiza local sem refetch completo
      setTasks(prev => prev.filter(t => t.id !== id));
      setStats(prev => {
        const task = tasks.find(t => t.id === id);
        if (!task) return prev;
        return {
          ...prev,
          [task.status]: Math.max(0, prev[task.status] - 1),
          total: Math.max(0, prev.total - 1),
        };
      });
      return true;
    } catch {
      return false;
    }
  }, [tasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, stats, loading, error, fetchTasks, deleteTask };
}
