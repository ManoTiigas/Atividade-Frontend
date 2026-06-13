// src/types/Task.ts

export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  status: TaskStatus;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  priority?: Priority;
  status?: TaskStatus;
  due_date?: string;
}

export type UpdateTaskDTO = Partial<CreateTaskDTO>;

export interface TaskStats {
  pending: number;
  in_progress: number;
  done: number;
  total: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: { total: number };
}

export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
  };
}

// Navegação tipada
export type RootStackParamList = {
  List: undefined;
  Form: { task?: Task } | undefined;
};
