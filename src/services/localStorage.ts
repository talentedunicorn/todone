import { Todo } from "../models/todo";

// LocalStorage API
const DB_NAME = process.env.REACT_APP_DB_NAME || "todone";
const getDB = (): Todo[] =>
  JSON.parse(window.localStorage.getItem(DB_NAME) || "[]");
const setDB = (data: Todo[]) =>
  window.localStorage.setItem(DB_NAME, JSON.stringify(data));

// Queries
const GET_TODOS = new Promise<any>(resolve => {
  console.log("Getting Todos");
  const data = getDB();
  resolve(data);
});

const ADD_TODO = (text: string) =>
  new Promise<Todo>(resolve => {
    console.log(`Adding: ${text}`);
    const data = getDB();
    const newTodo: Todo = { id: new Date(), text, completed: false };
    setDB([...data, newTodo]);
    resolve(newTodo);
  });

const EDIT_TODO = (id: Number, text: string) =>
  new Promise<Todo>(resolve => {
    console.log(`Edit ${id} to: ${text}`);
    const data = getDB();
    const selected = data.find((todo: Todo) => todo.id === id);
    const newData: Todo[] = data.map((todo: any) => {
      if (todo.id === id) {
        todo.text = text;
      }
      return todo;
    });
    if (selected) {
      setDB(newData);
      resolve({ id, text, completed: selected && selected.completed });
    }
  });

const TOGGLE_TODO = (id: Number, completed: boolean) =>
  new Promise<Todo>(resolve => {
    console.log(`Set ${id} to ${completed ? "completed" : "incomplete"}`);
    const data = getDB();
    const selected = data.find((todo: Todo) => todo.id === id);
    const newData: Todo[] = data.map((todo: any) => {
      if (todo.id === id) {
        todo.completed = !selected?.completed;
      }
      return todo;
    });

    if (selected) {
      setDB(newData);
      resolve({ id, completed, text: selected?.text });
    }
  });

const DELETE_TODOS = (ids: Array<Number>) =>
  new Promise<any>(resolve => resolve(console.log(`Delete: ${ids.join(",")}`)));

export { GET_TODOS, ADD_TODO, EDIT_TODO, TOGGLE_TODO, DELETE_TODOS };
