export type RootMode = 'user' | 'global';

export const ROOT_MODE: RootMode = (import.meta.env.VITE_ROOT_MODE as RootMode) || 'user';
export const COLLECTION_NOTES = import.meta.env.VITE_COLLECTION_NOTES || 'notes';
export const COLLECTION_TASKS = import.meta.env.VITE_COLLECTION_TASKS || 'tasks';
