export type Priority = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  title: string;
  dueDate: string | null;
  priority: Priority;
  category: string;
  completed: boolean;
  createdAt: string;
}

export interface CreateTodoInput {
  title: string;
  dueDate?: string | null;
  priority?: Priority;
  category?: string;
}

export interface UpdateTodoInput {
  title?: string;
  dueDate?: string | null;
  priority?: Priority;
  category?: string;
  completed?: boolean;
}

export interface ErrorResponse {
  code: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
}
