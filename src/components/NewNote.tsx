import { useState } from 'react';
import { useAuth, useNotes } from '@/services/hooks';
import { useNavigate } from 'react-router-dom';

export function NewNote({ categories }: { categories: string[] }) {
  const { user } = useAuth();
  const { addNote } = useNotes(user?.uid);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [content, setContent] = useState('');

  const onCreate = async () => {
    if (!title.trim()) return;
    await addNote({ title, content, category });
    navigate('/notes');
  };

  return (
    <div className="form-card">
      <h2>Nueva nota</h2>
      <div className="form-row">
        <label>Título</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Lista de compras" />
      </div>
      <div className="form-row">
        <label>Categoría</label>
        <input value={category} list="categories" onChange={(e) => setCategory(e.target.value)} placeholder="Ej: Hogar" />
        <datalist id="categories">
          {categories.map((c) => (<option key={c} value={c} />))}
        </datalist>
      </div>
      <div className="form-row">
        <label>Contenido</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Escribe tu nota..." />
      </div>
      <div className="form-actions">
        <button className="btn" onClick={() => navigate(-1)}>Cancelar</button>
        <button className="primary" onClick={onCreate}>Crear</button>
      </div>
    </div>
  );
}
