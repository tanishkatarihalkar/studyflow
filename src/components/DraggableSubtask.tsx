import { useDraggable } from '@dnd-kit/core';
import type { CSSProperties } from 'react';
import { useStore } from '../store';

export function DraggableSubtask({ taskId, subtaskId }: { taskId: string; subtaskId: string }) {
  const task = useStore((s) => s.tasks[taskId]);
  const sub = task?.subtasks.find((st) => st.id === subtaskId);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: `sub-${taskId}-${subtaskId}` });
  const style: CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.6 : 1,
  };
  if (!task || !sub) return null;
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="rounded-lg border border-black/10 bg-white px-2 py-1 text-sm cursor-grab active:cursor-grabbing">
      {sub.title}
    </div>
  );
}
