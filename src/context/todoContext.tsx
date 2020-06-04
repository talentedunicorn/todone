import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Todo } from "../models/todo";
import service from "../services/index";

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
  const location = useLocation();
  const history = useHistory();

  const { GET_TODOS, ADD_TODO, EDIT_TODO, TOGGLE_TODO, DELETE_TODOS } = service;

  const toggleTodo = (id: number) => {
    const todo = (todolist && todolist.find(todo => todo.id === id)) || null;
    return (
      todo &&
      TOGGLE_TODO(id, !todo.completed).then((data: Todo) => {
        setTodolist(
          todolist && todolist.map(todo => (todo.id === id ? data : todo))
        );
      })
    );
  };

  const deleteTodo = (id: any) =>
    DELETE_TODOS([id]).then(() =>
      setTodolist(todolist && todolist.filter(todo => todo.id !== id))
    );

  const onAddTodo = (todo: Todo) =>
    ADD_TODO(todo.content).then((todo: Todo) => {
      setTodolist([...(todolist || []), todo]);
    });

  const editTodo = (id: number, content: string) => {
    if (Boolean(content.trim().length)) {
      return EDIT_TODO(id, content).then((updatedTodo: Todo) =>
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
    const fetchData = async () => {
      const token = window.localStorage.getItem("token");
      if (token || process.env.REACT_APP_STORAGE_TYPE === "offline") {
        const todos = await GET_TODOS();
        setTodolist(todos);
      }
    };

    fetchData();
  }, [GET_TODOS, location, history]);

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
