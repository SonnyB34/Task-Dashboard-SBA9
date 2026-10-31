import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import type { Status, Task, TaskFormData, Theme } from './types';
import { loadTasks, loadTheme, makeId, saveTasks, saveTheme } from './utils/taskUtils';

export default function App() {
  // The ONE place where tasks live. Everything else gets them as props.
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [theme, setTheme] = useState<Theme>(loadTheme);

  // Save automatically whenever tasks change.
  useEffect(() => saveTasks(tasks), [tasks]);

  // Apply the theme to the page and remember it.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    saveTheme(theme);
  }, [theme]);

  const addTask = (data: TaskFormData) =>
    setTasks((prev) => [
      { ...data, id: makeId(), status: 'todo', createdAt: Date.now() },
      ...prev,
    ]);

  const updateTask = (id: string, data: TaskFormData) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));

  const deleteTask = (id: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const changeStatus = (id: string, status: Status) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));

  // Take the dragged task out and put it where the target task was.
  const reorder = (fromId: string, toId: string) =>
    setTasks((prev) => {
      const from = prev.findIndex((t) => t.id === fromId);
      const to = prev.findIndex((t) => t.id === toId);
      if (from < 0 || to < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });

  return (
    <Dashboard
      tasks={tasks}
      theme={theme}
      onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
      onAdd={addTask}
      onUpdate={updateTask}
      onDelete={deleteTask}
      onStatusChange={changeStatus}
      onReorder={reorder}
      onImport={setTasks}
    />
  );
}