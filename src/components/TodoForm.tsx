'use client';

import { useState } from 'react';
import { createTodoAction } from '@/actions/todoActions';
import { Priority } from '@/lib/types';

interface TodoFormProps {
  onSuccess?: () => void;
}

export function TodoForm({ onSuccess }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState('一般');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('dueDate', dueDate || '');
    formData.append('priority', priority);
    formData.append('category', category);

    const result = await createTodoAction(formData);

    if (result.ok) {
      setTitle('');
      setDueDate('');
      setPriority('medium');
      setCategory('一般');
      onSuccess?.();
    } else {
      setErrors(result.error.fieldErrors || {});
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-lg font-semibold mb-4">新しいタスク</h2>
      
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          タスク名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="タスクを入力してください"
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
            期限
          </label>
          <input
            type="datetime-local"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
          {errors.dueDate && (
            <p className="text-red-500 text-sm mt-1">{errors.dueDate[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            優先度
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            カテゴリ
          </label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="カテゴリ"
            disabled={isSubmitting}
          />
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category[0]}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !title.trim()}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? '作成中...' : 'タスクを追加'}
      </button>
    </form>
  );
}
