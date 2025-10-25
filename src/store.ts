import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localforage from 'localforage';
import { nanoid } from 'nanoid/non-secure';
import type { Subject, Task, Exam, SubjectId, TaskId } from './types';

type State = {
  subjects: Record<SubjectId, Subject>;
  tasks: Record<TaskId, Task>;
  exams: Exam[];
};

type Actions = {
  addSubject: (name: string, color: string) => Subject;
  addTask: (
    task: Omit<Task, 'id' | 'subtasks' | 'completed'> & {
      subtasks?: Task['subtasks'];
      completed?: boolean;
    },
  ) => Task;
  updateTask: (id: TaskId, update: Partial<Task>) => void;
  toggleSubtask: (taskId: TaskId, subtaskId: string, done: boolean) => void;
  setTaskDueDate: (taskId: TaskId, isoDate?: string) => void;
  setSubtaskDueDate: (taskId: TaskId, subtaskId: string, isoDate?: string) => void;
  removeTask: (taskId: TaskId) => void;
};

export const useStore = create<State & Actions>()(
  persist(
    (set) => ({
      subjects: {},
      tasks: {},
      exams: [],
      addSubject: (name, color) => {
        const id = nanoid();
        const subject: Subject = { id, name, color };
        set((s) => ({ subjects: { ...s.subjects, [id]: subject } }));
        return subject;
      },
      addTask: (t) => {
        const id = nanoid();
        const task: Task = {
          id,
          title: t.title,
          subjectId: t.subjectId,
          notes: t.notes,
          dueDate: t.dueDate,
          estimateMinutes: t.estimateMinutes,
          completed: t.completed ?? false,
          subtasks: t.subtasks ?? [],
        };
        set((s) => ({ tasks: { ...s.tasks, [id]: task } }));
        return task;
      },
      updateTask: (id, update) => {
        set((s) => ({ tasks: { ...s.tasks, [id]: { ...s.tasks[id], ...update } } }));
      },
      toggleSubtask: (taskId, subtaskId, done) => {
        set((s) => {
          const task = s.tasks[taskId];
          if (!task) return {} as any;
          const subtasks = task.subtasks.map((st) => (st.id === subtaskId ? { ...st, done } : st));
          return { tasks: { ...s.tasks, [taskId]: { ...task, subtasks } } };
        });
      },
      setTaskDueDate: (taskId, isoDate) => {
        set((s) => ({ tasks: { ...s.tasks, [taskId]: { ...s.tasks[taskId], dueDate: isoDate } } }));
      },
      setSubtaskDueDate: (taskId, subtaskId, isoDate) => {
        set((s) => {
          const task = s.tasks[taskId];
          if (!task) return {} as any;
          const subtasks = task.subtasks.map((st) => (st.id === subtaskId ? { ...st, dueDate: isoDate } : st));
          return { tasks: { ...s.tasks, [taskId]: { ...task, subtasks } } };
        });
      },
      removeTask: (taskId) => {
        set((s) => {
          const { [taskId]: _removed, ...rest } = s.tasks;
          return { tasks: rest };
        });
      },
    }),
    {
      name: 'studyflow-store',
      storage: createJSONStorage(() => localforage),
      version: 1,
    },
  ),
);

export function tasksByDate(dateISO: string) {
  const { tasks } = useStore.getState();
  return Object.values(tasks).filter((t) => t.dueDate === dateISO);
}
