import { addMinutes, compareAsc, isAfter, isBefore, parseISO } from 'date-fns';
import type { Task, Exam, PlannerSettings } from '../types';

export type PlanBlock = {
  taskId: string;
  start: string; // ISO datetime
  end: string;   // ISO datetime
};

// Simple greedy planner: schedule upcoming tasks before exams, within availability
export function generatePlan(
  tasks: Task[],
  _exams: Exam[],
  settings: PlannerSettings,
  startDateISO: string,
  daysHorizon = 14,
): PlanBlock[] {
  // Flatten availability into absolute blocks across horizon
  const startDate = parseISO(startDateISO);
  const availability: { start: string; end: string }[] = [];
  for (let i = 0; i < daysHorizon; i++) {
    const date = addMinutes(startDate, i * 24 * 60);
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }); // Mon, Tue, ...
    const windows = settings.weeklyAvailability[weekday] || [];
    for (const w of windows) {
      const [sh, sm] = w.start.split(':').map(Number);
      const [eh, em] = w.end.split(':').map(Number);
      const blockStart = new Date(date);
      blockStart.setHours(sh, sm, 0, 0);
      const blockEnd = new Date(date);
      blockEnd.setHours(eh, em, 0, 0);
      availability.push({ start: blockStart.toISOString(), end: blockEnd.toISOString() });
    }
  }
  availability.sort((a, b) => compareAsc(parseISO(a.start), parseISO(b.start)));

  const items = tasks
    .filter((t) => !t.completed)
    .map((t) => ({
      task: t,
      due: t.dueDate ? parseISO(`${t.dueDate}T23:59:00Z`) : undefined,
      minutes: t.estimateMinutes || 30,
    }))
    .sort((a, b) => {
      if (a.due && b.due) return compareAsc(a.due, b.due);
      if (a.due) return -1;
      if (b.due) return 1;
      return 0;
    });

  const plan: PlanBlock[] = [];
  for (const slot of availability) {
    const slotStart = parseISO(slot.start);
    const slotEnd = parseISO(slot.end);
    let cursor = slotStart;
    for (const item of items) {
      if (item.minutes <= 0) continue;
      if (item.due && isAfter(cursor, item.due)) continue; // skip if past due
      const end = addMinutes(cursor, item.minutes);
      if (isBefore(end, slotEnd) || end.getTime() === slotEnd.getTime()) {
        plan.push({ taskId: item.task.id, start: cursor.toISOString(), end: end.toISOString() });
        item.minutes = 0;
        cursor = end;
      }
    }
  }
  return plan;
}
