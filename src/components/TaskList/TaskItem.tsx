import type { Status, TaskItemProps } from '../../types';
import { formatDate, isOverdue } from '../../utils/taskUtils';

export default function TaskItem({ task, draggable, onStatusChange, onDelete, onEdit, onDragStart, onDrop }: TaskItemProps) {
    return (
        <li
            className={`task priority-${task.priority} ${task.status === 'done' ? 'is-done' : ''}`}
            draggable={draggable}
            onDragStart={() => onDragStart(task.id)}
            onDragOver={(e) => e.preventDefault()} // required or the drop is blocked
            onDrop={() => onDrop(task.id)}
            >
            <div className="task-main">
                <h3>{task.title}</h3>
                {task.description && <p>{task.description}</p>}
                <div className="meta">
                    <span className={`badge ${task.priority}`}>{task.priority}</span>
                    <span className={isOverdue(task) ? 'overdue' : ''}>
                        {isOverdue(task) ? 'Overdue' : ''}{formatDate(task.dueDate)}
                    </span>
                </div>
            </div>
            <div className="task-actions">
        <select
          aria-label={`Status of ${task.title}`}
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as Status)}
        >
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </select>
        <button type="button" onClick={() => onEdit(task)}>Edit</button>
        <button type="button" className="danger" onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </li>

    )
}