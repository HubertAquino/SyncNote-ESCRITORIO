import { Link } from 'react-router-dom';
import { Note } from '@/types/models';
import { useAuth, useNotes } from '@/services/hooks';

export function NoteList({ notes }: { notes: Note[] }) {
  const { user } = useAuth();
  const { updateNote } = useNotes(user?.uid);
  return (
    <div className="note-list">
      {notes.map((n) => (
        <Link key={n.id} to={`/note/${n.id}`} className="note-item">
          <div className="note-item-head">
            <h3>{n.title}</h3>
            <div className="note-item-actions" onClick={(e)=>e.preventDefault()}>
              <button className={`pin ${n.pinned ? 'pinned' : ''}`} onClick={() => updateNote(n.id!, { pinned: !n.pinned })}>★</button>
            </div>
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
