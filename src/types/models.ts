export type ID = string;

export type Task = {
  id?: ID;
  title: string;
  done: boolean;
  createdAt: number;
  updatedAt: number;
  dueDate?: number | null;
};

export type Note = {
  id?: ID;
  title: string;
  content: string;
  category: string;
  createdAt: number;
  updatedAt: number;
  pinned?: boolean;
  tasks?: Task[];
};
