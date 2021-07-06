/* eslint-disable new-cap */
import React, { useState, useContext } from "react";
import { Todo } from "../models/todo";
import bobaService from "../services/boba";
import localService from "../services/localStorage";
import { AuthContext } from "./authContext";
import { NotificationContext } from "./notificationContext";

type contextProps = {
  todolist: Array<Todo> | null;
  selected: Todo | null;
  selectTodo: any;
  getTodos: any;
  onAddTodo: any;
  toggleTodo: any;
  deleteTodo: any;
  editTodo: any;
};

const TodoContext = React.createContext<Partial<contextProps>>({});
const TodoProvider = (props: any) => {
  const [todolist, setTodolist] = useState<Array<Todo> | null>(null);
  const [selected, selectTodo] = useState<Todo | null>(null);
  const { notify } = useContext(NotificationContext);
  const { token } = useContext(AuthContext);

  const { GET_TODOS, ADD_TODO, EDIT_TODO, TOGGLE_TODO, DELETE_TODOS } = !token
    ? localService
    : bobaService;

  const toggleTodo = (id: number) => {
    const todo = (todolist && todolist.find((todo) => todo.id === id)) || null;
    return (
      todo &&
      TOGGLE_TODO(id, !todo.completed, token || "").then((data: Todo) => {
        setTodolist(
          todolist && todolist.map((todo) => (todo.id === id ? data : todo))
        );
      })
    );
  };

  const deleteTodo = (id: any) =>
    DELETE_TODOS([id], token || "").finally(() => {
      setTodolist(todolist && todolist.filter((todo) => todo.id !== id));
      notify("Deleted successfully", "success");
    });

  const onAddTodo = (todo: Todo) =>
    ADD_TODO(todo.content, token || "").then((todo: Todo) => {
      setTodolist([...(todolist || []), todo]);
    });

  const editTodo = (id: number, content: string) => {
    if (Boolean(content.trim().length)) {
      return EDIT_TODO(id, content, token || "").then((updatedTodo: Todo) => {
        setTodolist(
          todolist &&
            todolist.map((todo: Todo) => {
              if (todo.id === id) {
                return updatedTodo;
              }
              return todo;
            })
        );
        notify("Updated successfully", "success");
      });
    }
  };

  const getTodos = () => {
    return GET_TODOS(token || "").then((data: Todo[]) => setTodolist(data));
  };

  const implementation: contextProps = {
    selected,
    selectTodo,
    getTodos,
    todolist,
    toggleTodo,
    deleteTodo,
    onAddTodo,
    editTodo,
  };

  return (
    <TodoContext.Provider value={implementation}>
      {props.children}
    </TodoContext.Provider>
  );
};

export { TodoContext, TodoProvider };
