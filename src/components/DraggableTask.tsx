import { useDraggable } from '@dnd-kit/core';
import type { CSSProperties } from 'react';
import { useStore } from '../store';

export function DraggableTask({ id }: { id: string }) {
  const task = useStore((s) => s.tasks[id]);
  const subjects = useStore((s) => s.subjects);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const style: CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.6 : 1,
  };
  if (!task) return null;
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="rounded-lg border border-black/10 bg-white px-2 py-1 text-sm cursor-grab active:cursor-grabbing">
      <span className="inline-block h-2 w-2 rounded-full mr-2" style={{ background: subjects[task.subjectId]?.color }} />
      {task.title}
    </div>
  );
}
