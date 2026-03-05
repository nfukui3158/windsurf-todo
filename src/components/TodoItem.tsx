'use client';

import { useState } from 'react';
import { Todo } from '@/lib/types';
import { toggleTodoAction, deleteTodoAction } from '@/actions/todoActions';

interface TodoItemProps {
  todo: Todo;
  onUpdate: () => void;
}

const priorityLabels: Record<string, { label: string; color: string }> = {
  high: { label: '高', color: 'bg-red-100 text-red-800' },
  medium: { label: '中', color: 'bg-yellow-100 text-yellow-800' },
  low: { label: '低', color: 'bg-green-100 text-green-800' },
};

export function TodoItem({ todo, onUpdate }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;
  const priorityInfo = priorityLabels[todo.priority] || { label: todo.priority, color: 'bg-gray-100' };

  const handleToggle = async () => {
    if (isToggling) return;
    setIsToggling(true);
    await toggleTodoAction(todo.id);
    onUpdate();
    setIsToggling(false);
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    await deleteTodoAction(todo.id);
    onUpdate();
    setIsDeleting(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${isOverdue ? 'border-red-500' : 'border-blue-500'} ${todo.completed ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          disabled={isToggling}
          className="mt-1 w-5 h-5 cursor-pointer"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs px-2 py-1 rounded-full ${priorityInfo.color}`}>
              {priorityInfo.label}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              {todo.category}
            </span>
            {isOverdue && (
              <span className="text-xs px-2 py-1 rounded-full bg-red-500 text-white">
                期限切れ
              </span>
            )}
          </div>
          
          <h3 className={`text-base font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {todo.title}
          </h3>
          
          {todo.dueDate && (
            <p className={`text-sm mt-1 ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
              期限: {formatDate(todo.dueDate)}
            </p>
          )}
        </div>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
          title="削除"
        >
          {isDeleting ? '...' : '×'}
        </button>
      </div>
    </div>
  );
}
