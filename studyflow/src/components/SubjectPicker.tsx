import { useState } from 'react';
import { useStore } from '../store';

const PRESETS = [
  { name: 'Math', color: '#E6E6FF' },
  { name: 'Science', color: '#D9F0FF' },
  { name: 'History', color: '#FFF9C4' },
  { name: 'Language', color: '#FFE0E6' },
  { name: 'Art', color: '#CFFFE5' },
];

export function SubjectPicker({ onPicked }: { onPicked: (subjectId: string) => void }) {
  const subjects = useStore((s) => s.subjects);
  const addSubject = useStore((s) => s.addSubject);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#E6E6FF');

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {Object.values(subjects).map((s) => (
          <button key={s.id} className="btn justify-start" onClick={() => onPicked(s.id)}>
            <span className="inline-block h-3 w-3 rounded-full mr-2" style={{ background: s.color }} />
            {s.name}
          </button>
        ))}
      </div>
      <div className="p-3 rounded-xl border border-black/10 bg-white">
        <div className="text-sm font-medium mb-2">New subject</div>
        <div className="flex gap-2 items-center">
          <input className="flex-1 rounded-xl border-black/10" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="color" className="rounded-lg" value={color} onChange={(e) => setColor(e.target.value)} />
          <button
            className="btn"
            onClick={() => {
              const created = addSubject(name || 'New Subject', color);
              onPicked(created.id);
            }}
          >
            Add
          </button>
        </div>
        <div className="flex gap-2 mt-2">
          {PRESETS.map((p) => (
            <button key={p.name} className="h-6 w-6 rounded-full border border-black/10" style={{ background: p.color }} onClick={() => setColor(p.color)} />
          ))}
        </div>
      </div>
    </div>
  );
}
