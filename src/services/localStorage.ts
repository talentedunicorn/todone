import { Todo } from "../models/todo";

// LocalStorage API
const DB_NAME = process.env.REACT_APP_DB_NAME || "todone";
const getDB = (): Todo[] =>
  JSON.parse(window.localStorage.getItem(DB_NAME) || "[]");
const setDB = (data: Todo[]) =>
  window.localStorage.setItem(DB_NAME, JSON.stringify(data));

// Queries
const GET_TODOS = () =>
  new Promise<any>(resolve => {
    const data = getDB();
    resolve(data);
  });

const ADD_TODO = (content: string) =>
  new Promise<Todo>(resolve => {
    const data = getDB();
    const newTodo: Todo = { id: new Date(), content, completed: false };
    setDB([...data, newTodo]);
    resolve(newTodo);
  });

const EDIT_TODO = (id: Number, content: string) =>
  new Promise<Todo>(resolve => {
    const data = getDB();
    const selected = data.find((todo: Todo) => todo.id === id);
    const newData: Todo[] = data.map((todo: any) => {
      if (todo.id === id) {
        todo.content = content;
      }
      return todo;
    });
    if (selected) {
      setDB(newData);
      resolve({ id, content, completed: selected && selected.completed });
    }
  });

const TOGGLE_TODO = (id: Number, completed: boolean) =>
  new Promise<Todo>(resolve => {
    const data = getDB();
    const selected = data.find((todo: Todo) => todo.id === id);
    if (selected) {
      const newData: Todo[] = data.map((todo: any) => {
        if (todo.id === id) {
          todo.completed = !selected.completed;
        }
        return todo;
      });
      setDB(newData);
      resolve({ id, completed, content: selected?.content });
    }
  });

const DELETE_TODOS = (ids: Array<Number>) =>
  new Promise<any>(resolve => {
    const data = getDB();
    const newData = data.filter((todo: Todo) => !ids.includes(todo.id));
    setDB(newData);
    resolve();
  });

export default { GET_TODOS, ADD_TODO, EDIT_TODO, TOGGLE_TODO, DELETE_TODOS };
