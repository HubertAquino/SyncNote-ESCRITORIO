import { Link } from 'react-router-dom';
import { Note } from '@/types/models';

export function NoteList({ notes }: { notes: Note[] }) {
  return (
    <div className="note-list">
      {notes.map((n) => (
        <Link key={n.id} to={`/note/${n.id}`} className="note-item">
          <div className="note-item-head">
            <h3>{n.title}</h3>
            <small>{new Date(n.updatedAt).toLocaleDateString()}</small>
          </div>
          <p className="note-item-content">{n.content.slice(0, 140)}</p>
          <div className="note-item-foot">
            <span className="chip">{n.category}</span>
            <span>{n.tasks?.filter((t) => t.done).length ?? 0}/{n.tasks?.length ?? 0} tareas</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
