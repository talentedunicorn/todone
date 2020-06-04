import localforage from "localforage";
import { Todo } from "../models/todo";

const DB_NAME = process.env.REACT_APP_DB_NAME || "todone_db";

// Configure database
const db = localforage.createInstance({
  name: DB_NAME
});

// Queries
const GET_TODOS = async () => {
  const allKeys = await db.keys();
  return Promise.all(allKeys.map(key => db.getItem(key.toString())));
};

const ADD_TODO = (content: string) => {
  const todo = { id: `${Date.now()}`, content, completed: false };
  return db.setItem(todo.id, todo);
};

const EDIT_TODO = async (id: any, content: string) => {
  const todo: Todo = await db.getItem(id);
  return db.setItem(id, { ...todo, content });
};

const TOGGLE_TODO = async (id: any, completed: boolean) => {
  const todo: Todo = await db.getItem(id);
  return db.setItem(id, { ...todo, completed });
};

const DELETE_TODOS = (ids: any[]) =>
  new Promise<any>(resolve => resolve(db.removeItem(ids[0])));

export default { GET_TODOS, ADD_TODO, EDIT_TODO, TOGGLE_TODO, DELETE_TODOS };
