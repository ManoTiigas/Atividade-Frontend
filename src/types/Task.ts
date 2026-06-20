export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  status: TaskStatus;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  priority?: Priority;
  status?: TaskStatus;
}

export type UpdateTaskDTO = Partial<CreateTaskDTO>;

export type RootStackParamList = {
  List: undefined;
  Form: { task?: Task } | undefined;
};
