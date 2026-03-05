import { z } from 'zod';

// 優先度のEnum
const PrioritySchema = z.enum(['high', 'medium', 'low']);

// CreateTodoInputのバリデーションスキーマ
export const CreateTodoInputSchema = z.object({
  title: z.string()
    .min(1, 'タスク名は必須です')
    .max(100, 'タスク名は100文字以内で入力してください'),
  dueDate: z.string()
    .datetime({ message: '日時形式が不正です' })
    .nullable()
    .optional(),
  priority: PrioritySchema
    .optional()
    .default('medium'),
  category: z.string()
    .max(20, 'カテゴリは20文字以内で入力してください')
    .optional()
    .default('一般'),
});

// UpdateTodoInputのバリデーションスキーマ
export const UpdateTodoInputSchema = z.object({
  title: z.string()
    .min(1, 'タスク名は必須です')
    .max(100, 'タスク名は100文字以内で入力してください')
    .optional(),
  dueDate: z.string()
    .datetime({ message: '日時形式が不正です' })
    .nullable()
    .optional(),
  priority: PrioritySchema.optional(),
  category: z.string()
    .max(20, 'カテゴリは20文字以内で入力してください')
    .optional(),
  completed: z.boolean().optional(),
});

// バリデーション結果の型
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string[]> };

// バリデーション実行関数
export function validateCreateTodoInput(input: unknown): ValidationResult<{
  title: string;
  dueDate: string | null;
  priority: 'high' | 'medium' | 'low';
  category: string;
}> {
  const result = CreateTodoInputSchema.safeParse(input);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors: Record<string, string[]> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  }
  
  return { success: false, errors };
}

export function validateUpdateTodoInput(input: unknown): ValidationResult<{
  title?: string;
  dueDate?: string | null;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
  completed?: boolean;
}> {
  const result = UpdateTodoInputSchema.safeParse(input);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors: Record<string, string[]> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  }
  
  return { success: false, errors };
}
