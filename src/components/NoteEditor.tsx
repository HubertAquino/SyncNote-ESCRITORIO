import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, useNotes } from '@/services/hooks';

export function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notes, updateNote, deleteNote, toggleTask, addTask } = useNotes(user?.uid);

  const note = useMemo(() => notes.find((n) => n.id === id), [notes, id]);
  const [title, setTitle] = useState(note?.title ?? '');
  const [content, setContent] = useState(note?.content ?? '');
  const [category, setCategory] = useState(note?.category ?? 'General');

  if (!note) {
    return (
      <div>
        <p>No se encontró la nota.</p>
        <button onClick={() => navigate('/')}>Volver</button>
      </div>
    );
  }

  const onSave = async () => {
    await updateNote(note.id!, { title, content, category });
    navigate('/');
  };

  return (
    <div className="editor">
      <div className="editor-header">
        <button onClick={() => navigate('/')}>←</button>
        <h2>Editar nota</h2>
        <div className="spacer" />
  <button onClick={() => updateNote(note.id!, { pinned: !note.pinned })}>{note.pinned ? 'Desfijar' : 'Fijar'}</button>
  <button onClick={() => deleteNote(note.id!).then(() => navigate('/'))}>Eliminar</button>
      </div>

      <input className="editor-title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="editor-category" value={category} onChange={(e) => setCategory(e.target.value)} />
      <textarea className="editor-content" value={content} onChange={(e) => setContent(e.target.value)} />
      <button className="primary" onClick={onSave}>Guardar</button>

      <div className="tasks">
        <h3>Tareas</h3>
        <ul>
          {note.tasks?.map((t) => (
            <li key={t.id} className="task-row">
              <label>
                <input type="checkbox" checked={t.done} onChange={() => toggleTask(note.id!, t.id!, !t.done)} />
                <span className={t.done ? 'done' : ''}>{t.title}</span>
              </label>
              {t.dueDate && <small className="muted">vence {new Date(t.dueDate).toLocaleDateString()}</small>}
            </li>
          ))}
        </ul>
        <AddTask onAdd={(data) => addTask(note.id!, data.title, data.dueDate)} />
      </div>
    </div>
  );
}

function AddTask({ onAdd }: { onAdd: (t: { title: string; dueDate?: number | null }) => void }) {
  const [text, setText] = useState('');
  const [due, setDue] = useState<string>('');
  return (
    <div className="add-task">
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Nueva tarea" />
      <input type="date" value={due} onChange={(e)=>setDue(e.target.value)} />
      <button onClick={() => { if (text.trim()) { onAdd({ title: text.trim(), dueDate: due ? new Date(due).getTime() : null }); setText(''); setDue(''); } }}>Añadir</button>
    </div>
  );
}
