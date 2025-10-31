export type ID = string;

export type Task = {
  id?: ID;
  title: string;
  done: boolean;
  createdAt: number;
  updatedAt: number;
};

export type Note = {
  id?: ID;
  title: string;
  content: string;
  category: string;
  createdAt: number;
  updatedAt: number;
  tasks?: Task[];
};
