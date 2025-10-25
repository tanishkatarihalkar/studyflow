import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom'
import BoardPage from './pages/BoardPage'
import CalendarPage from './pages/CalendarPage'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-black/5">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold">StudyFlow</Link>
          <nav className="flex gap-2">
            <NavLink to="/" end className={({isActive}) => `btn ${isActive ? 'bg-black/10' : ''}`}>Dashboard</NavLink>
            <NavLink to="/board" className={({isActive}) => `btn ${isActive ? 'bg-black/10' : ''}`}>Task Board</NavLink>
            <NavLink to="/calendar" className={({isActive}) => `btn ${isActive ? 'bg-black/10' : ''}`}>Calendar</NavLink>
            <NavLink to="/planner" className={({isActive}) => `btn ${isActive ? 'bg-black/10' : ''}`}>AI Planner</NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  )
}

import { format } from 'date-fns'
import { useStore } from './store'

function Dashboard() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const tasks = Object.values(useStore((s) => s.tasks))
  const exams = useStore((s) => s.exams)
  const subjects = useStore((s) => s.subjects)
  const todays = tasks.filter((t) => t.dueDate === today && !t.completed)
  const completedCountBySubject: Record<string, number> = {}
  const totalCountBySubject: Record<string, number> = {}
  tasks.forEach((t) => {
    totalCountBySubject[t.subjectId] = (totalCountBySubject[t.subjectId] ?? 0) + 1
    if (t.completed) completedCountBySubject[t.subjectId] = (completedCountBySubject[t.subjectId] ?? 0) + 1
  })

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <section className="card p-4 md:col-span-2">
        <h2 className="text-lg font-semibold mb-2">Today’s Tasks</h2>
        {todays.length === 0 ? (
          <div className="text-sm text-black/60">No tasks due today</div>
        ) : (
          <ul className="space-y-2">
            {todays.map((t) => (
              <li key={t.id} className="flex items-center justify-between rounded-xl border border-black/10 p-2">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ background: subjects[t.subjectId]?.color ?? '#ddd' }}
                  />
                  <span className="font-medium">{t.title}</span>
                </div>
                <span className="text-xs text-black/50">{t.estimateMinutes ?? 30} min</span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="card p-4">
        <h2 className="text-lg font-semibold mb-2">Upcoming Exams</h2>
        {exams.length === 0 ? (
          <div className="text-sm text-black/60">No exams yet</div>
        ) : (
          <ul className="space-y-2">
            {exams.map((e) => (
              <li key={e.id} className="flex items-center justify-between rounded-xl border border-black/10 p-2">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ background: subjects[e.subjectId]?.color ?? '#ddd' }}
                  />
                  <span className="font-medium">{e.title}</span>
                </div>
                <span className="text-xs text-black/50">{format(new Date(e.date), 'MMM d')}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="card p-4 md:col-span-3">
        <h2 className="text-lg font-semibold mb-2">Progress by Subject</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {Object.values(subjects).length === 0 ? (
            <div className="text-sm text-black/60">No subjects yet</div>
          ) : (
            Object.values(subjects).map((s) => {
              const total = totalCountBySubject[s.id] ?? 0
              const done = completedCountBySubject[s.id] ?? 0
              const pct = total === 0 ? 0 : Math.round((done / total) * 100)
              return (
                <div key={s.id} className="p-3 rounded-xl border border-black/10 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 rounded-full" style={{ background: s.color }} />
                      <span className="font-medium">{s.name}</span>
                    </div>
                    <span className="text-xs text-black/60">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-black/5 overflow-hidden">
                    <div className="h-full" style={{ width: `${pct}%`, background: s.color }} />
                  </div>
                </div>
              )
            })
          )}
        </div>
      </section>
    </div>
  )
}

// removed unused placeholder components

import React from 'react'
import { generatePlan } from './lib/planner'

function Planner() {
  const tasks = Object.values(useStore((s) => s.tasks))
  const exams = useStore((s) => s.exams)
  const subjects = useStore((s) => s.subjects)
  const [blocks, setBlocks] = React.useState<ReturnType<typeof generatePlan>>([] as any)
  const [settings] = React.useState({
    weeklyAvailability: {
      Mon: [{ start: '17:00', end: '20:00' }],
      Tue: [{ start: '17:00', end: '20:00' }],
      Wed: [{ start: '17:00', end: '20:00' }],
      Thu: [{ start: '17:00', end: '20:00' }],
      Fri: [{ start: '17:00', end: '20:00' }],
      Sat: [{ start: '10:00', end: '14:00' }],
      Sun: [{ start: '10:00', end: '14:00' }],
    },
  })
  return (
    <div className="card p-4 space-y-3">
      <h2 className="text-lg font-semibold">AI Study Planner</h2>
      <p className="text-sm text-black/60">Create schedules based on time, exams, and subjects.</p>
      <button
        className="btn"
        onClick={() => setBlocks(generatePlan(tasks as any, exams as any, settings as any, new Date().toISOString().slice(0,10)+"T00:00:00Z"))}
      >
        Generate Plan
      </button>
      {blocks.length > 0 && (
        <ul className="space-y-2">
          {blocks.map((b, i) => (
            <li key={i} className="rounded-xl border border-black/10 bg-white p-2 text-sm">
              <span className="inline-block h-2 w-2 rounded-full mr-2" style={{ background: subjects[(tasks as any).find((t:any)=>t.id===b.taskId)?.subjectId]?.color }} />
              { (tasks as any).find((t:any)=>t.id===b.taskId)?.title }: {new Date(b.start).toLocaleString()} - {new Date(b.end).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/planner" element={<Planner />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
