import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth, useNotes } from '@/services/hooks';
import { NoteList } from '@/components/NoteList';
import { NoteEditor } from '@/components/NoteEditor';
import { Home } from '@/components/Home';
import { TasksView } from '@/components/TasksView';
import { Sidebar } from '@/components/Sidebar';
import { NewNote } from '@/components/NewNote';

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
      <div className="layout">
        <Sidebar categories={categories} activeCategory={filter} onSelectCategory={setFilter} />
        <main className="content">
          <Routes>
            <Route path="/" element={<Home notes={notes} />} />
            <Route path="/notes" element={
              <>
                <div className="toolbar">
                  <Link to="/notes/new" className="primary">Nueva nota</Link>
                </div>
                <NoteList notes={visibleNotes} />
              </>
            } />
            <Route path="/notes/new" element={<NewNote categories={categories} />} />
            <Route path="/tasks" element={<TasksView />} />
            <Route path="/note/:id" element={<NoteEditor />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

// Componente auxiliar eliminado: se usa en NoteEditor
