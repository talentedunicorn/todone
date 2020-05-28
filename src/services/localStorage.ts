import { Todo } from "../models/todo";

// LocalStorage API
const DB_NAME = process.env.REACT_APP_DB_NAME || "todone_db";

const db = {
  get: () => JSON.parse(window.localStorage.getItem(DB_NAME) || "[]"),
  set: (data: any) => window.localStorage.setItem(DB_NAME, JSON.stringify(data))
};

// Queries
const GET_TODOS = () =>
  new Promise<any>(resolve => {
    const data = db.get();
    resolve(data);
  });

const ADD_TODO = (content: string) =>
  new Promise<Todo>(resolve => {
    const data = db.get();
    const newTodo: Todo = { id: new Date(), content, completed: false };
    db.set([...data, newTodo]);
    resolve(newTodo);
  });

const EDIT_TODO = (id: Number, content: string) =>
  new Promise<Todo>(resolve => {
    const data = db.get();
    const selected = data.find((todo: Todo) => todo.id === id);
    const newData: Todo[] = data.map((todo: any) => {
      if (todo.id === id) {
        todo.content = content;
      }
      return todo;
    });
    if (selected) {
      db.set(newData);
      resolve({ id, content, completed: selected && selected.completed });
    }
  });

const TOGGLE_TODO = (id: Number, completed: boolean) =>
  new Promise<Todo>(resolve => {
    const data = db.get();
    const selected = data.find((todo: Todo) => todo.id === id);
    if (selected) {
      const newData: Todo[] = data.map((todo: any) => {
        if (todo.id === id) {
          todo.completed = !selected.completed;
        }
        return todo;
      });
      db.set(newData);
      resolve({ id, completed, content: selected?.content });
    }
  });

const DELETE_TODOS = (ids: Array<Number>) =>
  new Promise<any>(resolve => {
    const data = db.get();
    const newData = data.filter((todo: Todo) => !ids.includes(todo.id));
    db.set(newData);
    resolve();
  });

export default { GET_TODOS, ADD_TODO, EDIT_TODO, TOGGLE_TODO, DELETE_TODOS };
