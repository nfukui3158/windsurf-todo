import { describe, it, expect } from 'vitest';
import {
  validateCreateTodoInput,
  validateUpdateTodoInput,
} from '../lib/validation';

describe('validation', () => {
  describe('validateCreateTodoInput', () => {
    it('有効な入力を検証する', () => {
      const result = validateCreateTodoInput({
        title: 'テストタスク',
        dueDate: '2026-03-15T10:00:00Z',
        priority: 'high',
        category: '仕事',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('テストタスク');
        expect(result.data.priority).toBe('high');
      }
    });

    it('デフォルト値を適用する', () => {
      const result = validateCreateTodoInput({
        title: 'シンプルタスク',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.priority).toBe('medium');
        expect(result.data.category).toBe('一般');
        expect(result.data.dueDate).toBeNull();
      }
    });

    it('空のタイトルを拒否する', () => {
      const result = validateCreateTodoInput({
        title: '',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.title).toContain('タスク名は必須です');
      }
    });

    it('長すぎるタイトルを拒否する', () => {
      const result = validateCreateTodoInput({
        title: 'a'.repeat(101),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.title).toContain('タスク名は100文字以内で入力してください');
      }
    });

    it('無効な優先度を拒否する', () => {
      const result = validateCreateTodoInput({
        title: 'タスク',
        priority: 'invalid',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.priority).toBeDefined();
      }
    });

    it('無効な日時形式を拒否する', () => {
      const result = validateCreateTodoInput({
        title: 'タスク',
        dueDate: 'invalid-date',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.dueDate).toContain('日時形式が不正です');
      }
    });

    it('長すぎるカテゴリを拒否する', () => {
      const result = validateCreateTodoInput({
        title: 'タスク',
        category: 'a'.repeat(21),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.category).toContain('カテゴリは20文字以内で入力してください');
      }
    });
  });

  describe('validateUpdateTodoInput', () => {
    it('有効な部分更新を検証する', () => {
      const result = validateUpdateTodoInput({
        title: '更新されたタイトル',
        completed: true,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('更新されたタイトル');
        expect(result.data.completed).toBe(true);
      }
    });

    it('空のオブジェクトを許可する', () => {
      const result = validateUpdateTodoInput({});

      expect(result.success).toBe(true);
    });

    it('空のタイトルを拒否する', () => {
      const result = validateUpdateTodoInput({
        title: '',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.title).toContain('タスク名は必須です');
      }
    });

    it('完了状態のみの更新を許可する', () => {
      const result = validateUpdateTodoInput({
        completed: true,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.completed).toBe(true);
        expect(result.data.title).toBeUndefined();
      }
    });
  });
});
