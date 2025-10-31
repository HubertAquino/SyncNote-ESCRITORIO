import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useAuth, useNotes } from '@/services/hooks';
import { NoteList } from '@/components/NoteList';
import { NoteEditor } from '@/components/NoteEditor';

export default function App() {
  const { user, signInAnonymously } = useAuth();
  const { notes, addNote, updateNote, deleteNote, toggleTask, addTask, filteredByCategory, categories } = useNotes(user?.uid);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [filter, setFilter] = useState<string | 'all'>('all');

  useEffect(() => {
    if (!user) signInAnonymously();
  }, [user, signInAnonymously]);

  const visibleNotes = useMemo(() => {
    if (filter === 'all') return notes;
    return filteredByCategory(filter);
  }, [notes, filter, filteredByCategory]);

  const handleCreate = async () => {
    if (!title.trim()) return;
    await addNote({ title, content, category });
    setTitle('');
    setContent('');
  };

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <header>
                  <h1>SyncNote</h1>
                  <div className="filters">
                    <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
                      <option value="all">Todas</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </header>
                <section className="create-note">
                  <input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
                  <input placeholder="Categoría" value={category} onChange={(e) => setCategory(e.target.value)} list="categories" />
                  <datalist id="categories">
                    {categories.map((c) => (<option key={c} value={c} />))}
                  </datalist>
                  <textarea placeholder="Contenido" value={content} onChange={(e) => setContent(e.target.value)} />
                  <button onClick={handleCreate}>Agregar</button>
                </section>
                <NoteList notes={visibleNotes} />
              </>
            }
          />
          <Route path="/note/:id" element={<NoteEditor />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

// Componente auxiliar eliminado: se usa en NoteEditor
