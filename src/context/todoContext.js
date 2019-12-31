import React, { useState, useEffect } from "react";

const TodoContext = React.createContext();
const TodoProvider = props => {
  const [todolist, setTodolist] = useState([]);

  const getList = _ => {
    const cachedTodos = window.localStorage.getItem(
      process.env.REACT_APP_DB_NAME
    );
    if (cachedTodos) {
      setTodolist([...JSON.parse(cachedTodos)]);
    }
  };

  const toggleTodo = id =>
    setTodolist(
      todolist.map(todo => {
        if (todo.id === id) {
          todo.completed = !todo.completed;
        }
        return todo;
      })
    );

  const deleteTodo = id => {
    setTodolist(todolist.filter(todo => todo.id !== id));
  };

  const onAddTodo = todo => {
    todo.id = new Date().getTime();
    setTodolist([...todolist, { ...todo }]);
  };

  useEffect(() => {
    if (Boolean(todolist.length)) {
      window.localStorage.setItem(
        process.env.REACT_APP_DB_NAME,
        JSON.stringify(todolist)
      );
    }
  }, [todolist]);

  const implementation = {
    todolist,
    getList,
    toggleTodo,
    deleteTodo,
    onAddTodo
  };

  return (
    <TodoContext.Provider value={implementation}>
      {props.children}
    </TodoContext.Provider>
  );
};

export { TodoContext, TodoProvider };
