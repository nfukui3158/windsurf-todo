'use client';

import { Priority } from '@/lib/types';
import { deleteCompletedTodosAction } from '@/actions/todoActions';

interface FilterBarProps {
  priority: Priority | 'all';
  setPriority: (priority: Priority | 'all') => void;
  category: string;
  setCategory: (category: string) => void;
  showCompleted: boolean;
  setShowCompleted: (show: boolean) => void;
  categories: string[];
  completedCount: number;
  onUpdate: () => void;
}

export function FilterBar({
  priority,
  setPriority,
  category,
  setCategory,
  showCompleted,
  setShowCompleted,
  categories,
  completedCount,
  onUpdate,
}: FilterBarProps) {
  const handleDeleteCompleted = async () => {
    if (confirm('完了済みのタスクを全て削除しますか？')) {
      await deleteCompletedTodosAction();
      onUpdate();
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* 優先度フィルター */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">優先度:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority | 'all')}
            className="text-sm border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">すべて</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </div>

        {/* カテゴリフィルター */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">カテゴリ:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-sm border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">すべて</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* 完了表示トグル */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showCompleted"
            checked={showCompleted}
            onChange={(e) => setShowCompleted(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="showCompleted" className="text-sm text-gray-700">
            完了済みを表示
          </label>
        </div>

        {/* 完了済み一括削除 */}
        {completedCount > 0 && (
          <button
            onClick={handleDeleteCompleted}
            className="text-sm text-red-600 hover:text-red-800 underline ml-auto"
          >
            完了済みを削除 ({completedCount}件)
          </button>
        )}
      </div>
    </div>
  );
}
