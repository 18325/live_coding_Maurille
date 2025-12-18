export interface User {
  _id: string;
  username: string;
  createdAt: Date;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  createdBy: User | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Editor {
  userId: string;
  username: string;
}

export interface ActiveNote {
  noteId: string;
  editors: Editor[];
}
