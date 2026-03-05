import { Todo, CreateTodoInput, UpdateTodoInput, Priority } from './types';

// インメモリストア
const todos: Todo[] = [];

// UUID生成
function generateId(): string {
  return crypto.randomUUID();
}

// 現在時刻取得（ISO形式）
function now(): string {
  return new Date().toISOString();
}

// ToDo作成
export function createTodo(input: CreateTodoInput): Todo {
  const todo: Todo = {
    id: generateId(),
    title: input.title,
    dueDate: input.dueDate ?? null,
    priority: input.priority ?? 'medium',
    category: input.category ?? '一般',
    completed: false,
    createdAt: now(),
  };
  todos.push(todo);
  return todo;
}

// ToDo一覧取得（フィルタリング対応）
export function getTodos(filters?: {
  priority?: Priority;
  category?: string;
  completed?: boolean;
}): Todo[] {
  let result = [...todos];
  
  if (filters?.priority !== undefined) {
    result = result.filter(t => t.priority === filters.priority);
  }
  if (filters?.category !== undefined) {
    result = result.filter(t => t.category === filters.category);
  }
  if (filters?.completed !== undefined) {
    result = result.filter(t => t.completed === filters.completed);
  }
  
  // 作成日時の降順でソート
  return result.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// ToDo取得（ID指定）
export function getTodoById(id: string): Todo | undefined {
  return todos.find(t => t.id === id);
}

// ToDo更新
export function updateTodo(id: string, input: UpdateTodoInput): Todo | undefined {
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) return undefined;
  
  const todo = todos[index];
  todos[index] = {
    ...todo,
    ...(input.title !== undefined && { title: input.title }),
    ...(input.dueDate !== undefined && { dueDate: input.dueDate }),
    ...(input.priority !== undefined && { priority: input.priority }),
    ...(input.category !== undefined && { category: input.category }),
    ...(input.completed !== undefined && { completed: input.completed }),
  };
  return todos[index];
}

// ToDo削除
export function deleteTodo(id: string): boolean {
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) return false;
  todos.splice(index, 1);
  return true;
}

// 完了済みToDoを一括削除
export function deleteCompletedTodos(): number {
  const beforeCount = todos.length;
  for (let i = todos.length - 1; i >= 0; i--) {
    if (todos[i].completed) {
      todos.splice(i, 1);
    }
  }
  return beforeCount - todos.length;
}
