import type { FilterOptions, TaskFilterProps } from '../../types';

export default function TaskFilter({
  filters,
  onChange,
  onClear,
}: TaskFilterProps) {
  // Copy the old filters, change one thing, send it up to the parent.
  const update = <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K],
  ) => onChange({ ...filters, [key]: value });

  // Build the list of chips that show whats active.
  const active: string[] = [];
  if (filters.search.trim()) active.push(`Search: "${filters.search.trim()}"`);
  if (filters.status !== 'all') active.push(`Status: ${filters.status}`);
  if (filters.priority !== 'all') active.push(`Priority: ${filters.priority}`);

  return (
    <section className="panel filters" aria-label="Search, filter and sort">
      <input
        type="search"
        value={filters.search}
        placeholder="Search tasks..."
        aria-label="Search tasks"
        onChange={(e) => update('search', e.target.value)}
      />

      <div className="row">
        <label>
          Status
          <select
            value={filters.status}
            onChange={(e) =>
              update('status', e.target.value as FilterOptions['status'])
            }>
                <option value="all">All</option>
                <option value="todo">To do</option>
                <option value="in-progress">In progress</option>
                <option value="done">Done</option>
            </select>
        </label>
        <label>
            Priority
            <select value={filters.priority} onChange={(e) => update('priority', e.target.value as FilterOptions['priority'])}>
                <option value="all">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
            </select>
        </label>
        <label>
            Sort by
            <select value={filters.sortBy} onChange={(e) => update('sortBy', e.target.value as FilterOptions['sortBy'])}>
                <option value="manual">My order</option>
                <option value="createdAt">Newest</option>
                <option value="dueDate">Due date</option>
                <option value="priority">Priority</option>
                <option value="title">Title A-Z</option>
            </select>
        </label>
      </div>

      {active.length > 0 && (
        <div className="chips" aria-live="polite">
            {active.map((text) => <span className="chip" key={text}>{text}</span>)}
            <button type="button" className="link" onClick={onClear}>Clear filters</button>
        </div>
      )}
    </section>
  );
}
