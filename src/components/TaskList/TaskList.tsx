import { useRef } from 'react';
import type { TaskListProps } from '../../types';
import TaskItem from './TaskItem';

export default function TaskList({
  tasks,
  canReorder,
  onStatusChange,
  onDelete,
  onEdit,
  onReorder,
}: TaskListProps) {
  // Remember which task is being dragged (a ref doesn't cause re-renders).
  const dragId = useRef<string | null>(null);

  if (tasks.length === 0) {
    return <p className="empty">No tasks here yet. Add one using the form!</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        // key = a unique name tag so React can track each item
        <TaskItem
          key={task.id}
          task={task}
          draggable={canReorder}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onEdit={onEdit}
          onDragStart={(id) => {
            dragId.current = id;
          }}
          onDrop={(targetId) => {
            if (dragId.current && dragId.current !== targetId)
              onReorder(dragId.current, targetId);
            dragId.current = null;
          }}
        />
      ))}
    </ul>
  );
}
