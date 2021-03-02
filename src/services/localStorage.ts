import localforage from "localforage";
import FileSaver from "file-saver";

const DB_NAME = process.env.REACT_APP_DB_NAME || "todone_db";

// Configure database
const db = localforage.createInstance({
  name: DB_NAME,
});

// Queries
const GET_TODOS = async () => {
  const allKeys = await db.keys();
  return Promise.all(allKeys.map((key) => db.getItem(key.toString())));
};

const ADD_TODO = (content: string) => {
  const todo = {
    id: `${Date.now()}`,
    content,
    completed: false,
    updated_at: `${Date.now()}`,
  };
  return db.setItem(todo.id, todo);
};

const EDIT_TODO = async (id: any, content: string) => {
  let todo: any = await db.getItem(id);
  todo.updated_at = `${Date.now()}`;
  todo.content = content;
  return db.setItem(id, { ...todo });
};

const TOGGLE_TODO = async (id: any, completed: boolean) => {
  let todo: any = await db.getItem(id);
  todo.completed = completed;
  return db.setItem(id, { ...todo });
};

const DELETE_TODOS = (ids: any[]) =>
  Promise.all(ids.map((id) => db.removeItem(id)));

const localStorage = {
  GET_TODOS,
  ADD_TODO,
  EDIT_TODO,
  TOGGLE_TODO,
  DELETE_TODOS,
};

export default localStorage;

export const exportData = async () => {
  const keys = await db.keys();
  const data = await Promise.all(keys.map((key) => db.getItem(key.toString())));
  // Build file from data and trigger download
  const fileData = new Blob([JSON.stringify({ data })], {
    type: "text/plain;charset=utf-8",
  });
  FileSaver.saveAs(fileData, `${DB_NAME}.json`);
};

export const importData = async (data: any[]) => {
  if (!Array.isArray(data)) {
    throw new Error("Invalid data. Please try a different file");
  } else {
    await Promise.all(data.map((item: any) => db.setItem(item.id, item)));
  }
};
