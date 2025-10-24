import { useState } from 'react';
import { useStore } from '../store';
import { SubjectPicker } from '../components/SubjectPicker';
import { DraggableTask } from '../components/DraggableTask';
import { DraggableSubtask } from '../components/DraggableSubtask';

export default function BoardPage() {
  const tasks = useStore((s) => s.tasks);
  const subjects = useStore((s) => s.subjects);
  const addTask = useStore((s) => s.addTask);
  const updateTask = useStore((s) => s.updateTask);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [title, setTitle] = useState('');

  const handleCreate = () => {
    if (!subjectId || !title.trim()) return;
    addTask({ title: title.trim(), subjectId, subtasks: [] });
    setTitle('');
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <section className="card p-4">
        <h2 className="text-lg font-semibold mb-2">Subjects</h2>
        <SubjectPicker onPicked={setSubjectId} />
      </section>
      <section className="card p-4 md:col-span-2 space-y-3">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-xl border-black/10"
            placeholder={subjectId ? `Add task for ${subjects[subjectId]?.name}` : 'Pick a subject first'}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="btn" onClick={handleCreate}>Add</button>
        </div>
        <div className="space-y-3">
          {Object.values(tasks).map((t) => (
            <div key={t.id} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <DraggableTask id={t.id} />
                <label className="text-sm flex items-center gap-2">
                  <input type="checkbox" checked={t.completed} onChange={(e) => updateTask(t.id, { completed: e.target.checked })} />
                  Done
                </label>
              </div>
              {t.subtasks.length > 0 && (
                <div className="pl-4 grid gap-1">
                  {t.subtasks.map((st) => (
                    <DraggableSubtask key={st.id} taskId={t.id} subtaskId={st.id} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-sm text-black/60">Drag onto a calendar day (on Calendar page) to set due date.</div>
      </section>
    </div>
  );
}
