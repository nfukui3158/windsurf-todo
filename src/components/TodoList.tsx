'use client';

import { Todo } from '@/lib/types';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onUpdate: () => void;
}

export function TodoList({ todos, onUpdate }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg mb-2">タスクがありません</p>
        <p className="text-sm">新しいタスクを追加してみましょう！</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onUpdate={onUpdate} />
      ))}
    </div>
  );
}
