import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { auth, db, signInAnonymously } from '@/firebase';
import { ROOT_MODE, COLLECTION_NOTES, COLLECTION_TASKS } from '@/config';
import { Note, Task } from '@/types/models';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  getDocs,
  Unsubscribe,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export function useAuth() {
  const [user, setUser] = useState<{ uid: string } | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser({ uid: u.uid });
      else setUser(null);
    });
    return () => unsub();
  }, []);

  const signInAnon = useCallback(() => signInAnonymously(), []);

  return { user, signInAnonymously: signInAnon } as const;
}

export function useNotes(uid?: string) {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (!uid) return;
    const tasksUnsubs = new Map<string, Unsubscribe>();
    const qNotes = query(collection(db, ...buildNotesPath(uid)));
    const unsubNotes = onSnapshot(qNotes, (snap) => {
      const baseNotes: Note[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as Note));
      // Limpiar subs de notas eliminadas
      const currentIds = new Set(baseNotes.map((n) => n.id!));
      for (const [nid, unsub] of tasksUnsubs) {
        if (!currentIds.has(nid)) {
          unsub();
          tasksUnsubs.delete(nid);
        }
      }

      // Suscribirse a tareas por nota si no existe
      for (const n of baseNotes) {
        const noteId = n.id!;
        if (!tasksUnsubs.has(noteId)) {
          const qTasks = query(collection(db, ...buildTasksPath(uid, noteId)), orderBy('createdAt', 'asc'));
          const unsubTasks = onSnapshot(qTasks, (tSnap) => {
            const tasks: Task[] = tSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as Task));
            setNotes((prev) => {
              // Si la nota no existe aún en estado, se agregará con tasks
              const exists = prev.some((p) => p.id === noteId);
              const next = exists ? prev.map((p) => (p.id === noteId ? { ...p, tasks } : p)) : [...prev, { ...n, tasks }];
              return next.sort((a, b) => b.updatedAt - a.updatedAt);
            });
          });
          tasksUnsubs.set(noteId, unsubTasks);
        }
      }

      // Establecer notas base inicialmente (sin tareas o con las que ya lleguen)
      setNotes((prev) => {
        const merged = baseNotes.map((bn) => {
          const found = prev.find((p) => p.id === bn.id);
          return found ? { ...bn, tasks: found.tasks } : bn;
        });
        return merged.sort((a, b) => b.updatedAt - a.updatedAt);
      });
    });
    return () => {
      unsubNotes();
      for (const [, unsub] of tasksUnsubs) unsub();
      tasksUnsubs.clear();
    };
  }, [uid]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((n) => set.add(n.category));
    return Array.from(set).sort();
  }, [notes]);

  const filteredByCategory = useCallback((cat: string) => notes.filter((n) => n.category === cat), [notes]);

  const addNote = useCallback(async (input: { title: string; content: string; category: string }) => {
    if (!uid && ROOT_MODE === 'user') return;
    const now = Date.now();
    await addDoc(collection(db, ...buildNotesPath(uid!)), {
      title: input.title,
      content: input.content,
      category: input.category || 'General',
      pinned: false,
      createdAt: now,
      updatedAt: now,
    });
  }, [uid]);

  const updateNote = useCallback(async (id: string, patch: Partial<Note>) => {
    if (!uid && ROOT_MODE === 'user') return;
    const noteRef = ROOT_MODE === 'user' ? doc(db, 'users', uid!, COLLECTION_NOTES, id) : doc(db, COLLECTION_NOTES, id);
    await updateDoc(noteRef, {
      ...patch,
      updatedAt: Date.now(),
    } as any);
  }, [uid]);

  const deleteNote = useCallback(async (id: string) => {
    if (!uid && ROOT_MODE === 'user') return;
    const noteRef = ROOT_MODE === 'user' ? doc(db, 'users', uid!, COLLECTION_NOTES, id) : doc(db, COLLECTION_NOTES, id);
    await deleteDoc(noteRef);
  }, [uid]);

  const addTask = useCallback(async (noteId: string, title: string, dueDate?: number | null) => {
    if (!uid && ROOT_MODE === 'user') return;
    const now = Date.now();
    await addDoc(collection(db, ...buildTasksPath(uid!, noteId)), {
      title,
      done: false,
      createdAt: now,
      updatedAt: now,
      dueDate: dueDate ?? null,
    });
  }, [uid]);

  const toggleTask = useCallback(async (noteId: string, taskId: string, done: boolean) => {
    if (!uid && ROOT_MODE === 'user') return;
    const taskRef = ROOT_MODE === 'user'
      ? doc(db, 'users', uid!, COLLECTION_NOTES, noteId, COLLECTION_TASKS, taskId)
      : doc(db, COLLECTION_NOTES, noteId, COLLECTION_TASKS, taskId);
    await updateDoc(taskRef, {
      done,
      updatedAt: Date.now(),
    });
  }, [uid]);

function buildNotesPath(uid?: string): [string, ...string[]] {
  if (ROOT_MODE === 'user') {
    return ['users', uid!, COLLECTION_NOTES];
  }
  return [COLLECTION_NOTES];
}

function buildTasksPath(uid: string, noteId: string): [string, ...string[]] {
  if (ROOT_MODE === 'user') {
    return ['users', uid, COLLECTION_NOTES, noteId, COLLECTION_TASKS];
  }
  return [COLLECTION_NOTES, noteId, COLLECTION_TASKS];
}

  return { notes, addNote, updateNote, deleteNote, addTask, toggleTask, filteredByCategory, categories } as const;
}

// Ya no se usa la variante single-shot; mantenemos suscripción en tiempo real por nota
