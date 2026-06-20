import {
  Task,
  CreateTaskDTO,
  UpdateTaskDTO,
} from '../types/Task';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

console.log('API URL:', BASE_URL);


async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  let res: Response;

  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
  } catch {
    throw new Error('Sem conexão com o servidor.');
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const body = await res.json();

  if (!res.ok) {
    throw new Error(
      body?.error ?? 'Erro desconhecido'
    );
  }

  return body as T;
}

export const taskApi = {
  getAll: (): Promise<Task[]> =>
    request<Task[]>('/tasks'),

  getById: (id: string): Promise<Task> =>
    request<Task>(`/tasks/${id}`),

  create: (
    dto: CreateTaskDTO
  ): Promise<Task> =>
    request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  update: (
    id: string,
    dto: UpdateTaskDTO
  ): Promise<Task> =>
    request<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    }),

  delete: (id: string): Promise<void> =>
    request<void>(`/tasks/${id}`, {
      method: 'DELETE',
    }),
};