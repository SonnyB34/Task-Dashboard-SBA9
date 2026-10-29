export type Status = 'todo' | 'in-progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';
export type SortKey = 'manual' | 'createdAt' | 'dueDate' | 'priority' | 'title';
export type Theme = 'light' | 'dark';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate: string;
  createdAt: number;
}

// What the form collects
export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
}

export type FormErrors = Partial<Record<keyof TaskFormData, string>>;

export interface FilterOptions {
  search: string;
  status: Status | 'all';
  priority: Priority | 'all';
  sortBy: SortKey;
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  percentDone: number;
}

// ---- Props: what each component is handed by its parent ----
export interface TaskFormProps {
  editingTask: Task | null;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
}

export interface TaskFilterProps {
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
  onClear: () => void;
}

export interface TaskItemProps {
  task: Task;
  draggable: boolean;
  onStatusChange: (id: string, status: Status) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDragStart: (id: string) => void;
  onDrop: (targetId: string) => void;
}

export interface TaskListProps {
  tasks: Task[];
  canReorder: boolean;
  onStatusChange: (id: string, status: Status) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onReorder: (fromId: string, toId: string) => void;
}

export interface DashboardProps {
  tasks: Task[];
  theme: Theme;
  onToggleTheme: () => void;
  onAdd: (data: TaskFormData) => void;
  onUpdate: (id: string, data: TaskFormData) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Status) => void;
  onReorder: (fromId: string, toId: string) => void;
  onImport: (tasks: Task[]) => void;
}