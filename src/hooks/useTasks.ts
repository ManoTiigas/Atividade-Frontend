import { useState, useCallback, useEffect } from 'react';
import { Task } from '../types/Task';
import { taskApi } from '../services/api';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setTasks(await taskApi.getAll());
    } catch (err: any) {
      setError(err.message ?? 'Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    try {
      await taskApi.delete(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  return { tasks, loading, error, fetchTasks, deleteTask };
}
