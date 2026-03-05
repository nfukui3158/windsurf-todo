'use server';

import { revalidatePath } from 'next/cache';
import { 
  createTodo, 
  getTodos, 
  getTodoById, 
  updateTodo as updateTodoInStore, 
  deleteTodo as deleteTodoInStore,
  deleteCompletedTodos 
} from '@/lib/todoStore';
import { 
  validateCreateTodoInput, 
  validateUpdateTodoInput 
} from '@/lib/validation';
import { Priority } from '@/lib/types';

// エラーレスポンス生成
function errorResponse(code: string, message: string, fieldErrors?: Record<string, string[]>) {
  return { ok: false, error: { code, message, fieldErrors } };
}

// ToDo作成
export async function createTodoAction(formData: FormData) {
  const rawInput = {
    title: formData.get('title') as string,
    dueDate: formData.get('dueDate') as string | null,
    priority: (formData.get('priority') as Priority) || 'medium',
    category: (formData.get('category') as string) || '一般',
  };

  // dueDateが空文字の場合はnullに変換
  if (rawInput.dueDate === '') {
    rawInput.dueDate = null;
  }

  const validation = validateCreateTodoInput(rawInput);
  if (!validation.success) {
    return errorResponse('VALIDATION_ERROR', '入力が不正です', validation.errors);
  }

  const todo = createTodo(validation.data);
  revalidatePath('/');
  return { ok: true, data: todo };
}

// ToDo一覧取得
export async function getTodosAction(filters?: {
  priority?: Priority;
  category?: string;
  completed?: boolean;
}) {
  const todos = getTodos(filters);
  return { ok: true, data: todos };
}

// ToDo更新
export async function updateTodoAction(id: string, formData: FormData) {
  const existing = getTodoById(id);
  if (!existing) {
    return errorResponse('NOT_FOUND', '指定されたToDoが見つかりません');
  }

  const rawInput: Record<string, unknown> = {};
  
  const title = formData.get('title');
  if (title !== null) rawInput.title = title as string;
  
  const dueDate = formData.get('dueDate');
  if (dueDate !== null) rawInput.dueDate = dueDate === '' ? null : (dueDate as string);
  
  const priority = formData.get('priority');
  if (priority !== null) rawInput.priority = priority as Priority;
  
  const category = formData.get('category');
  if (category !== null) rawInput.category = category as string;
  
  const completed = formData.get('completed');
  if (completed !== null) rawInput.completed = completed === 'true';

  const validation = validateUpdateTodoInput(rawInput);
  if (!validation.success) {
    return errorResponse('VALIDATION_ERROR', '入力が不正です', validation.errors);
  }

  const todo = updateTodoInStore(id, validation.data);
  revalidatePath('/');
  return { ok: true, data: todo };
}

// ToDo削除
export async function deleteTodoAction(id: string) {
  const existing = getTodoById(id);
  if (!existing) {
    return errorResponse('NOT_FOUND', '指定されたToDoが見つかりません');
  }

  deleteTodoInStore(id);
  revalidatePath('/');
  return { ok: true };
}

// 完了済みToDoを一括削除
export async function deleteCompletedTodosAction() {
  const count = deleteCompletedTodos();
  revalidatePath('/');
  return { ok: true, data: { deletedCount: count } };
}

// ToDo完了状態切り替え
export async function toggleTodoAction(id: string) {
  const existing = getTodoById(id);
  if (!existing) {
    return errorResponse('NOT_FOUND', '指定されたToDoが見つかりません');
  }

  const todo = updateTodoInStore(id, { completed: !existing.completed });
  revalidatePath('/');
  return { ok: true, data: todo };
}
