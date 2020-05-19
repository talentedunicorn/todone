import React, { useState, useEffect } from "react";
import { Todo } from "../models/todo";
import localService from "../services/localStorage";
import keystoneService from "../services/keystone";

type contextProps = {
  todolist: Array<Todo> | null;
  onAddTodo: any;
  toggleTodo: any;
  deleteTodo: any;
  editTodo: any;
};

const TodoContext = React.createContext<Partial<contextProps>>({});
const TodoProvider = (props: any) => {
  const [todolist, setTodolist] = useState<Array<Todo> | null>(null);
  let service;

  // Select storage service
  switch (process.env.REACT_APP_STORAGE_TYPE) {
    case "keystone":
      service = keystoneService;
      break;
    default:
      service = localService;
  }

  const { GET_TODOS, ADD_TODO, EDIT_TODO, TOGGLE_TODO, DELETE_TODOS } = service;

  const toggleTodo = (id: number) => {
    const todo = (todolist && todolist.find(todo => todo.id === id)) || null;
    todo &&
      TOGGLE_TODO(id, !todo.completed).then((data: Todo) => {
        setTodolist(
          todolist && todolist.map(todo => (todo.id === id ? data : todo))
        );
      });
  };

  const deleteTodo = (id: number) => {
    DELETE_TODOS([id]).then(() =>
      setTodolist(todolist && todolist.filter(todo => todo.id !== id))
    );
  };

  const onAddTodo = (todo: Todo) =>
    ADD_TODO(todo.text).then((todo: Todo) => {
      setTodolist([...(todolist || []), todo]);
    });

  const editTodo = (id: number, text: string) => {
    if (Boolean(text.trim().length)) {
      EDIT_TODO(id, text).then((updatedTodo: Todo) =>
        setTodolist(
          todolist &&
            todolist.map((todo: Todo) => {
              if (todo.id === id) {
                return updatedTodo;
              }
              return todo;
            })
        )
      );
    }
  };

  useEffect(() => {
    if (process.env.REACT_APP_STORAGE_TYPE === "keystone") {
      keystoneService.LOGIN().then(() =>
        GET_TODOS().then((todos: Array<Todo>) => {
          setTodolist([...(todos || [])]);
        })
      );
    } else {
      GET_TODOS().then((todos: Array<Todo>) => {
        setTodolist([...(todos || [])]);
      });
    }
  }, [GET_TODOS]);

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
