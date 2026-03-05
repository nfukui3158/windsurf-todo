'use client';

import { useState, useCallback, useEffect } from 'react';
import { TodoForm } from '@/components/TodoForm';
import { TodoList } from '@/components/TodoList';
import { FilterBar } from '@/components/FilterBar';
import { getTodosAction } from '@/actions/todoActions';
import { Todo, Priority } from '@/lib/types';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [priority, setPriority] = useState<Priority | 'all'>('all');
  const [category, setCategory] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(true);

  const loadTodos = useCallback(async () => {
    const result = await getTodosAction({
      priority: priority === 'all' ? undefined : priority,
      category: category === 'all' ? undefined : category,
      completed: showCompleted ? undefined : false,
    });
    if (result.ok) {
      setTodos(result.data);
    }
  }, [priority, category, showCompleted]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const categories = Array.from(new Set(todos.map((t) => t.category))).sort();
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">ToDo App</h1>
        <TodoForm onSuccess={loadTodos} />
        <FilterBar
          priority={priority}
          setPriority={setPriority}
          category={category}
          setCategory={setCategory}
          showCompleted={showCompleted}
          setShowCompleted={setShowCompleted}
          categories={categories}
          completedCount={completedCount}
          onUpdate={loadTodos}
        />
        <div className="mb-4 text-sm text-gray-600">
          全{todos.length}件{completedCount > 0 && `（完了${completedCount}件）`}
        </div>
        <TodoList todos={todos} onUpdate={loadTodos} />
      </div>
    </main>
  );
}
