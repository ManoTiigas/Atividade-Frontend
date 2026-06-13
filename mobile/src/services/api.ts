// src/services/api.ts
//
// ATENÇÃO: Substituir BASE_URL pelo IP local da máquina antes de rodar.
// Android Emulator: http://10.0.2.2:3333/api/v1
// Dispositivo físico: http://<SEU_IP_LOCAL>:3333/api/v1
// iOS Simulator: http://localhost:3333/api/v1

import {
  Task,
  CreateTaskDTO,
  UpdateTaskDTO,
  ApiResponse,
  ApiErrorBody,
  TaskStats,
} from '../types/Task';

const BASE_URL = 'http://10.0.2.2:3333/api/v1';

// Erro tipado para facilitar o tratamento no componente
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: { field: string; message: string }[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response;

  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new ApiError('NETWORK_ERROR', 'Sem conexão com o servidor. Verifique se o backend está rodando.');
  }

  // 204 No Content — sem body
  if (res.status === 204) return undefined as unknown as T;

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = (body as ApiErrorBody).error;
    throw new ApiError(
      err?.code ?? 'UNKNOWN_ERROR',
      err?.message ?? 'Erro desconhecido',
      err?.details
    );
  }

  return body as T;
}

export const taskApi = {
  getAll(): Promise<ApiResponse<Task[]>> {
    return request<ApiResponse<Task[]>>('/tasks');
  },

  getById(id: string): Promise<ApiResponse<Task>> {
    return request<ApiResponse<Task>>(`/tasks/${id}`);
  },

  create(dto: CreateTaskDTO): Promise<ApiResponse<Task>> {
    return request<ApiResponse<Task>>('/tasks', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  update(id: string, dto: UpdateTaskDTO): Promise<ApiResponse<Task>> {
    return request<ApiResponse<Task>>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
  },

  delete(id: string): Promise<void> {
    return request<void>(`/tasks/${id}`, { method: 'DELETE' });
  },

  getStats(): Promise<ApiResponse<TaskStats>> {
    return request<ApiResponse<TaskStats>>('/tasks/stats');
  },
};
