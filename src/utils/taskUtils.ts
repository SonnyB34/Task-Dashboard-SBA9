import type {
  FilterOptions, FormErrors, Priority, Task, TaskFormData, TaskStats,
} from '../types';

const STORAGE_KEY = 'task-dashboard:tasks';
const THEME_KEY = 'task-dashboard:theme';

// ---------- Filtering ----------
export function filterTasks(tasks: Task[], f: FilterOptions): Task[] {
  const q = f.search.trim().toLowerCase();
  return tasks.filter((t) => {
    const matchesSearch =
      q === '' ||
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q);
    const matchesStatus = f.status === 'all' || t.status === f.status;
    const matchesPriority = f.priority === 'all' || t.priority === f.priority;
    return matchesSearch && matchesStatus && matchesPriority;
  });
}

// ---------- Sorting ----------
const priorityRank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export function sortTasks(tasks: Task[], sortBy: FilterOptions['sortBy']): Task[] {
  const copy = [...tasks]; // never change the original array
  switch (sortBy) {
    case 'createdAt':
      return copy.sort((a, b) => b.createdAt - a.createdAt);
    case 'dueDate':
      // tasks without a due date go to the bottom
      return copy.sort((a, b) =>
        (a.dueDate || '9999').localeCompare(b.dueDate || '9999'));
    case 'priority':
      return copy.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);
    case 'title':
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return copy; // 'manual' keeps the order you dragged them into
  }
}

// ---------- Validation ----------
export function validateTask(data: TaskFormData): FormErrors {
  const errors: FormErrors = {};
  const title = data.title.trim();
  if (!title) errors.title = 'Please give your task a title.';
  else if (title.length < 3) errors.title = 'Title needs at least 3 characters.';
  else if (title.length > 60) errors.title = 'Title can be at most 60 characters.';
  if (data.description.length > 200)
    errors.description = 'Description can be at most 200 characters.';
  if (data.dueDate && Number.isNaN(Date.parse(data.dueDate)))
    errors.dueDate = 'That date does not look right.';
  return errors;
}

// ---------- Dates ----------
export function formatDate(date: string): string {
  if (!date) return 'No due date';
  return new Date(date + 'T00:00:00').toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === 'done') return false;
  const today = new Date().toISOString().slice(0, 10);
  return task.dueDate < today;
}

// ---------- Stats ----------
export function getStats(tasks: Task[]): TaskStats {
  const todo = tasks.filter((t) => t.status === 'todo').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const done = tasks.filter((t) => t.status === 'done').length;
  const total = tasks.length;
  return {
    total, todo, inProgress, done,
    percentDone: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}

export const makeId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

// ---------- localStorage ----------
export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch {
    return []; // broken data? start fresh instead of crashing
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Could not save tasks', err);
  }
}

export function loadTheme(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch { /* ignore */ }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function saveTheme(theme: 'light' | 'dark'): void {
  try { localStorage.setItem(THEME_KEY, theme); } catch { 
    
  }
}

// ---------- Export / Import ----------
export function exportTasks(tasks: Task[]): void {
  const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tasks.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function parseImportedTasks(text: string): Task[] {
  const data: unknown = JSON.parse(text);
  if (!Array.isArray(data)) throw new Error('File must contain a list of tasks.');
  return data.map((item) => {
    if (!item || typeof item.title !== 'string')
      throw new Error('Every task needs a title.');
    return {
      id: typeof item.id === 'string' ? item.id : makeId(),
      title: item.title,
      description: typeof item.description === 'string' ? item.description : '',
      status: ['todo', 'in-progress', 'done'].includes(item.status) ? item.status : 'todo',
      priority: ['low', 'medium', 'high'].includes(item.priority) ? item.priority : 'medium',
      dueDate: typeof item.dueDate === 'string' ? item.dueDate : '',
      createdAt: typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
    } as Task;
  });
}