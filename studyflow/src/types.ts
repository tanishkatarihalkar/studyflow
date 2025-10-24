export type SubjectId = string;
export type TaskId = string;
export type SubtaskId = string;

export type Subject = {
  id: SubjectId;
  name: string;
  color: string; // hex or tailwind token key
};

export type Subtask = {
  id: SubtaskId;
  title: string;
  done: boolean;
  dueDate?: string; // ISO date YYYY-MM-DD
};

export type Task = {
  id: TaskId;
  subjectId: SubjectId;
  title: string;
  notes?: string;
  dueDate?: string; // ISO date YYYY-MM-DD
  estimateMinutes?: number;
  completed: boolean;
  subtasks: Subtask[];
};

export type Exam = {
  id: string;
  subjectId: SubjectId;
  title: string;
  date: string; // ISO date
};

export type PlannerSettings = {
  weeklyAvailability: Record<string, { start: string; end: string }[]>; // e.g. { Mon: [{start:"17:00", end:"20:00"}] }
};
