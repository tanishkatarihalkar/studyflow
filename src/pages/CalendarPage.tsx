import { useMemo, useState } from 'react';
import { DndContext, useDroppable } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { format, isSameMonth } from 'date-fns';
import { getMonthGrid, getWeekGrid, toISODate } from '../lib/date';
import { useStore } from '../store';
import { DraggableTask } from '../components/DraggableTask';
import { DraggableSubtask } from '../components/DraggableSubtask';

function DayCell({ dateISO }: { dateISO: string }) {
  const { setNodeRef, isOver } = useDroppable({ id: `day-${dateISO}` });
  const tasks = Object.values(useStore((s) => s.tasks)).filter((t) => t.dueDate === dateISO);
  const subjects = useStore((s) => s.subjects);
  return (
    <div ref={setNodeRef} className={`h-28 rounded-xl border border-black/10 bg-white p-2 overflow-hidden ${isOver ? 'ring-2 ring-black/10' : ''}`}>
      <div className="text-xs text-black/60 mb-1">{dateISO.slice(8, 10)}</div>
      <div className="space-y-1">
        {tasks.slice(0, 3).map((t) => (
          <div key={t.id} className="truncate rounded-lg px-2 py-1 text-xs" style={{ background: subjects[t.subjectId]?.color }}>
            {t.title}
          </div>
        ))}
        {tasks.length > 3 && <div className="text-[10px] text-black/50">+{tasks.length - 3} more</div>}
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const [cursor, setCursor] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const days = useMemo(() => (view === 'month' ? getMonthGrid(cursor) : getWeekGrid(cursor)), [cursor, view]);
  const updateTaskDue = useStore((s) => s.setTaskDueDate);
  const updateSubDue = useStore((s) => s.setSubtaskDueDate);
  const tasks = useStore((s) => s.tasks);

  const onDragEnd = (e: DragEndEvent) => {
    const { over, active } = e;
    if (!over || !active) return;
    const m = /^day-(\d{4}-\d{2}-\d{2})$/.exec(String(over.id));
    if (!m) return;
    const dateISO = m[1];
    const aid = String(active.id);
    if (aid.startsWith('sub-')) {
      const [, taskId, subId] = aid.split('-');
      updateSubDue(taskId, subId, dateISO);
    } else {
      updateTaskDue(aid, dateISO);
    }
  };

  return (
    <DndContext onDragEnd={onDragEnd}>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="card p-4 space-y-3 md:col-span-1">
          <h3 className="text-sm font-semibold text-black/70">Unscheduled</h3>
          <div className="space-y-2">
            {Object.values(tasks)
              .filter((t) => !t.dueDate)
              .map((t) => (
                <div key={t.id} className="space-y-1">
                  <DraggableTask id={t.id} />
                  {t.subtasks
                    .filter((st) => !st.dueDate)
                    .map((st) => (
                      <div key={st.id} className="pl-4">
                        <DraggableSubtask taskId={t.id} subtaskId={st.id} />
                      </div>
                    ))}
                </div>
              ))}
          </div>
        </div>
        <div className="md:col-span-3 card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">{format(cursor, 'MMMM yyyy')}</h2>
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-xl border border-black/10 overflow-hidden">
                <button className={`px-3 py-1.5 text-sm ${view==='week'?'bg-black/5':''}`} onClick={() => setView('week')}>Week</button>
                <button className={`px-3 py-1.5 text-sm ${view==='month'?'bg-black/5':''}`} onClick={() => setView('month')}>Month</button>
              </div>
              <button className="btn" onClick={() => setCursor(new Date())}>Today</button>
            </div>
          </div>
          <div className={`grid gap-2 ${view==='month'?'grid-cols-7':'grid-cols-7'}`}>
            {days.map((d) => (
              <div key={d.toISOString()} className={view==='month' && !isSameMonth(d, cursor) ? 'opacity-40' : ''}>
                <DayCell dateISO={toISODate(d)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DndContext>
  );
}
