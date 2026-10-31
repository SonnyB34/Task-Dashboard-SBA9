import { useMemo, useRef, useState } from 'react';
import type { DashboardProps, FilterOptions, Task } from '../../types';
import TaskForm from '../TaskForm/TaskForm';
import TaskFilter from '../TaskFilter/TaskFilter';
import TaskList from '../TaskList/TaskList';
import { exportTasks, filterTasks, getStats, parseImportedTasks, sortTasks, } from '../../utils/taskUtils';

const defaultFilters: FilterOptions = {
    search: '', status: 'all', priority: 'all', sortBy: 'manual',
};

export default function Dashboard(props: DashboardProps) {
    const { tasks, theme, onToggleTheme } = props;
    const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
    const [editing, setEditing] = useState<Task | null>(null);
    const [message, setMessage] = useState('');
    const fileInput = useRef<HTMLInputElement>(null)

    //only recalculate when tasks or filters change.
    const visible = useMemo(() => sortTasks(filterTasks(tasks, filters), filters.sortBy), [tasks, filters],);
    const stats = useMemo(() => getStats(tasks), [tasks]);

    // Dragging only makes sense when nothing hides or re sorts the list.
    const canReorder = filters.sortBy === 'manual' && !filters.search && filters.status === 'all' && filters.priority === 'all';

     const handleSubmit = (data: Parameters<DashboardProps['onAdd']>[0]) => {
    if (editing) {
      props.onUpdate(editing.id, data);
      setEditing(null);
    } else {
      props.onAdd(data);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      props.onImport(parseImportedTasks(await file.text()));
      setMessage('Tasks imported!');
    } catch (err) {
      setMessage(err instanceof Error ? `Import failed: ${err.message}` : 'Import failed.');
    }
    e.target.value = ''; // lets you pick the same file again
  };

  return (
    <div className="dashboard">
      <header className="top">
        <h1>Task Dashboard</h1>
        <button type="button" onClick={onToggleTheme} aria-label="Toggle light and dark mode">
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </button>
      </header>

      <section className="stats" aria-label="Task statistics">
        <div><strong>{stats.total}</strong> total</div>
        <div><strong>{stats.todo}</strong> to do</div>
        <div><strong>{stats.inProgress}</strong> in progress</div>
        <div><strong>{stats.done}</strong> done</div>
        <div className="bar" role="progressbar" aria-valuenow={stats.percentDone}
          aria-valuemin={0} aria-valuemax={100} aria-label="Percent complete">
          <span style={{ width: `${stats.percentDone}%` }} />
        </div>
      </section>

      <div className="layout">
        <aside>
          <TaskForm editingTask={editing} onSubmit={handleSubmit}
            onCancel={() => setEditing(null)} />
          <div className="panel row">
            <button type="button" onClick={() => exportTasks(tasks)}>Export</button>
            <button type="button" onClick={() => fileInput.current?.click()}>Import</button>
            <input ref={fileInput} type="file" accept="application/json" hidden
              onChange={handleImport} />
          </div>
          {message && <p className="hint" role="status">{message}</p>}
        </aside>

        <main>
          <TaskFilter filters={filters} onChange={setFilters}
            onClear={() => setFilters({ ...defaultFilters, sortBy: filters.sortBy })} />
          {!canReorder && filters.sortBy === 'manual' && (
            <p className="hint">Clear your filters to drag tasks into a new order.</p>
          )}
          <TaskList tasks={visible} canReorder={canReorder}
            onStatusChange={props.onStatusChange} onDelete={props.onDelete}
            onEdit={(t) => { setEditing(t); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            onReorder={props.onReorder} />
        </main>
      </div>
    </div>
  );
}