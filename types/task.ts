export enum TaskStatus {
  TO_DO = "TO_DO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedTasksResponse {
  data: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type CreateTaskDto = {
  title: string;
  description?: string;
  status?: TaskStatus;
};

export type UpdateTaskDto = {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
};
