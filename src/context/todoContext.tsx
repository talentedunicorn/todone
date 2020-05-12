import React, { useState, useEffect } from "react";
import { Todo } from "../models/todo";
import {
  GET_TODOS,
  ADD_TODO,
  EDIT_TODO,
  TOGGLE_TODO,
  DELETE_TODOS
} from "../services/keystone";

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

  const getCachedList = () =>
    GET_TODOS.then((todos: Array<Todo>) => {
      setTodolist([...todos]);
    }).catch(error => {
      debugger;
    });

  const toggleTodo = (id: number) => {
    const todo = (todolist && todolist.find(todo => todo.id === id)) || null;
    todo &&
      TOGGLE_TODO(id, !todo.completed)
        .then((data: any) => {
          setTodolist(
            todolist &&
              todolist.map(todo =>
                todo.id === id ? data.data.data.updateTodo : todo
              )
          );
        })
        .catch(error => {
          debugger;
        });
  };

  const deleteTodo = (id: number) => {
    DELETE_TODOS([id]).then(_ =>
      setTodolist(todolist && todolist.filter(todo => todo.id !== id))
    );
  };

  const onAddTodo = (todo: Todo) =>
    ADD_TODO(todo.text)
      .then((todo: Todo) => {
        setTodolist([...(todolist || []), todo]);
      })
      .catch(error => {
        debugger;
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
    getCachedList();
  }, []);

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
