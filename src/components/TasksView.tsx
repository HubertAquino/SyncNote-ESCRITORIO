import { useMemo, useState } from 'react';
import { useAuth, useNotes } from '@/services/hooks';
import { Link } from 'react-router-dom';

export function TasksView() {
  const { user } = useAuth();
  const { notes, toggleTask } = useNotes(user?.uid);
  const [showDone, setShowDone] = useState(true);
  const allTasks = useMemo(() => {
    return notes.flatMap(n => (n.tasks || []).map(t => ({ noteId: n.id!, noteTitle: n.title, ...t })));
  }, [notes]);

  const visible = allTasks.filter(t => showDone ? true : !t.done);

  return (
    <div className="tasks-view">
      <header className="tasks-header">
        <h2>Todas las tareas</h2>
        <div className="spacer" />
        <label className="toggle">
          <input type="checkbox" checked={showDone} onChange={(e)=>setShowDone(e.target.checked)} /> Mostrar completadas
        </label>
      </header>
      <ul className="tasks-list">
        {visible.map(t => (
          <li key={`${t.noteId}-${t.id}`} className="task-row">
            <label>
              <input type="checkbox" checked={t.done} onChange={()=>toggleTask(t.noteId, t.id!, !t.done)} />
              <span className={t.done? 'done':''}>{t.title}</span>
            </label>
            <Link to={`/note/${t.noteId}`} className="note-link">{t.noteTitle}</Link>
          </li>
        ))}
      </ul>
      {visible.length === 0 && <p className="muted">No hay tareas para mostrar.</p>}
    </div>
  );
}
