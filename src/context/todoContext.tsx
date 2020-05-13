import React, { useState, useEffect } from "react";
import { Todo } from "../models/todo";

type contextProps = {
  todolist: Array<Todo> | null;
  onAddTodo: any;
  toggleTodo: any;
  deleteTodo: any;
  editTodo: any;
};

const DB_NAME = process.env.REACT_APP_DB_NAME || "todone";

const TodoContext = React.createContext<Partial<contextProps>>({});
const TodoProvider = (props: any) => {
  const [todolist, setTodolist] = useState<Array<Todo> | null>(null);

  const getCachedList = () => {
    const cachedTodos: string | null = window.localStorage.getItem(DB_NAME);
    if (cachedTodos) {
      setTodolist([...JSON.parse(cachedTodos)]);
    }
  };

  const toggleTodo = (id: number) =>
    setTodolist(
      todolist &&
        todolist.map(todo => {
          if (todo.id === id) {
            todo.completed = !todo.completed;
          }
          return todo;
        })
    );

  const deleteTodo = (id: number) => {
    setTodolist(todolist && todolist.filter(todo => todo.id !== id));
  };

  const onAddTodo = (todo: Todo) =>
    setTodolist([...(todolist || []), { ...todo, id: new Date().getTime() }]);

  const editTodo = (id: number, text: string) => {
    if (Boolean(text.trim().length)) {
      setTodolist(
        todolist &&
          todolist.map(todo => {
            if (id === todo.id) {
              todo.text = text;
            }

            return todo;
          })
      );
    }
  };

  useEffect(() => {
    if (todolist) {
      window.localStorage.setItem(DB_NAME, JSON.stringify(todolist));
    } else {
      getCachedList();
    }
  }, [todolist]);

  const implementation: contextProps = {
    todolist,
    toggleTodo,
    deleteTodo,
    onAddTodo,
    editTodo
  };

  return (
    <TodoContext.Provider value={implementation}>
      {props.children}
    </TodoContext.Provider>
  );
};

export { TodoContext, TodoProvider };
