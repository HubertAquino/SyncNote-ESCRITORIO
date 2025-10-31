import { Link } from 'react-router-dom';
import { Note } from '@/types/models';

export function Home({ notes }: { notes: Note[] }) {
  const pinned = notes.filter(n => n.pinned);
  const recent = notes
    .filter(n => !n.pinned)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 8);

  return (
    <div className="home">
      <header className="home-header">
        <h1>SyncNote</h1>
        <div className="home-actions">
          <Link to="/notes" className="btn">Todas las notas</Link>
          <Link to="/tasks" className="btn">Tareas</Link>
        </div>
      </header>

      <section>
        <h2>Fijadas</h2>
        {pinned.length === 0 ? <p className="muted">No tienes notas fijadas.</p> : <CardGrid notes={pinned} />}
      </section>

      <section>
        <h2>Recientes</h2>
        {recent.length === 0 ? <p className="muted">Crea tu primera nota para empezar.</p> : <CardGrid notes={recent} />}
      </section>
    </div>
  );
}

function CardGrid({ notes }: { notes: Note[] }) {
  return (
    <div className="grid">
      {notes.map(n => (
        <Link key={n.id} to={`/note/${n.id}`} className="card">
          <div className="card-head">
            <h3>{n.title}</h3>
            <span className="chip">{n.category}</span>
          </div>
          <p className="card-content">{n.content.slice(0, 140)}</p>
          <div className="card-foot">
            <small>{new Date(n.updatedAt).toLocaleString()}</small>
            <small>{(n.tasks?.filter(t=>t.done).length ?? 0)}/{n.tasks?.length ?? 0} tareas</small>
          </div>
        </Link>
      ))}
    </div>
  );
}
