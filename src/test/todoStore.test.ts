import { describe, it, expect, beforeEach } from 'vitest';
import {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  deleteCompletedTodos,
} from '../lib/todoStore';
import { CreateTodoInput, Priority } from '../lib/types';

// 各テスト前にストアをリセット
describe('todoStore', () => {
  beforeEach(() => {
    // 完了済みを全削除で初期化
    deleteCompletedTodos();
    const todos = getTodos();
    todos.forEach((t) => deleteTodo(t.id));
  });

  describe('createTodo', () => {
    it('タスクを作成する', () => {
      const input: CreateTodoInput = {
        title: 'テストタスク',
        priority: 'high',
        category: '仕事',
      };

      const todo = createTodo(input);

      expect(todo.title).toBe('テストタスク');
      expect(todo.priority).toBe('high');
      expect(todo.category).toBe('仕事');
      expect(todo.completed).toBe(false);
      expect(todo.id).toBeDefined();
      expect(todo.createdAt).toBeDefined();
    });

    it('デフォルト値でタスクを作成する', () => {
      const input: CreateTodoInput = {
        title: 'デフォルトタスク',
      };

      const todo = createTodo(input);

      expect(todo.priority).toBe('medium');
      expect(todo.category).toBe('一般');
      expect(todo.dueDate).toBeNull();
    });
  });

  describe('getTodos', () => {
    it('全タスクを取得する', () => {
      createTodo({ title: 'タスク1' });
      createTodo({ title: 'タスク2' });

      const todos = getTodos();

      expect(todos).toHaveLength(2);
    });

    it('優先度でフィルタする', () => {
      createTodo({ title: '高優先度', priority: 'high' });
      createTodo({ title: '中優先度', priority: 'medium' });
      createTodo({ title: '低優先度', priority: 'low' });

      const highTodos = getTodos({ priority: 'high' as Priority });

      expect(highTodos).toHaveLength(1);
      expect(highTodos[0].title).toBe('高優先度');
    });

    it('カテゴリでフィルタする', () => {
      createTodo({ title: '仕事タスク', category: '仕事' });
      createTodo({ title: '私用タスク', category: '私用' });

      const workTodos = getTodos({ category: '仕事' });

      expect(workTodos).toHaveLength(1);
      expect(workTodos[0].category).toBe('仕事');
    });

    it('完了状態でフィルタする', () => {
      const todo = createTodo({ title: '完了タスク' });
      updateTodo(todo.id, { completed: true });
      createTodo({ title: '未完了タスク' });

      const completedTodos = getTodos({ completed: true });
      const incompleteTodos = getTodos({ completed: false });

      expect(completedTodos).toHaveLength(1);
      expect(completedTodos[0].title).toBe('完了タスク');
      expect(incompleteTodos).toHaveLength(1);
      expect(incompleteTodos[0].title).toBe('未完了タスク');
    });
  });

  describe('updateTodo', () => {
    it('タスクを更新する', () => {
      const todo = createTodo({ title: '元のタイトル' });

      const updated = updateTodo(todo.id, { title: '新しいタイトル' });

      expect(updated).toBeDefined();
      expect(updated!.title).toBe('新しいタイトル');
    });

    it('完了状態を切り替える', () => {
      const todo = createTodo({ title: 'タスク' });

      updateTodo(todo.id, { completed: true });
      const updated = getTodoById(todo.id);

      expect(updated!.completed).toBe(true);
    });

    it('存在しないIDではundefinedを返す', () => {
      const result = updateTodo('invalid-id', { title: 'test' });

      expect(result).toBeUndefined();
    });
  });

  describe('deleteTodo', () => {
    it('タスクを削除する', () => {
      const todo = createTodo({ title: '削除するタスク' });

      const result = deleteTodo(todo.id);

      expect(result).toBe(true);
      expect(getTodos()).toHaveLength(0);
    });

    it('存在しないIDではfalseを返す', () => {
      const result = deleteTodo('invalid-id');

      expect(result).toBe(false);
    });
  });

  describe('deleteCompletedTodos', () => {
    it('完了済みタスクを一括削除する', () => {
      const todo1 = createTodo({ title: '完了1' });
      const todo2 = createTodo({ title: '完了2' });
      createTodo({ title: '未完了' });

      updateTodo(todo1.id, { completed: true });
      updateTodo(todo2.id, { completed: true });

      const deletedCount = deleteCompletedTodos();

      expect(deletedCount).toBe(2);
      expect(getTodos()).toHaveLength(1);
      expect(getTodos()[0].title).toBe('未完了');
    });
  });
});
