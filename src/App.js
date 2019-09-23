import React, { useState, useEffect } from "react";
import "./App.css";
import Layout from "./components/layout";
import List from "./components/list";
import Form from "./components/form";

const HeaderContent = _ => (
  <>
    <button>Clear</button>
  </>
);

const App = _ => {
  const [todos, setTodos] = useState([]);

  const toggleTodoCompleted = id => {
    setTodos(
      todos.map(todo => {
        if (todo.id === id) {
          todo.completed = !todo.completed;
        }
        return todo;
      })
    );
  };

  const deleteTodo = id => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleAddTodo = todo => {
    todo.id = new Date().getTime();
    setTodos([...todos, todo]);
  };

  const cacheTodos = _ => {
    window.localStorage.setItem(
      process.env.REACT_APP_DB_NAME,
      JSON.stringify(todos)
    );
  };

  useEffect(() => {
    // fetch todos from localstorage
    const cachedTodos = window.localStorage.getItem(
      process.env.REACT_APP_DB_NAME
    );
    if (cachedTodos) {
      setTodos(todos.concat(JSON.parse(cachedTodos)));
    }
  }, [todos]);

  return (
    <main data-testid="App">
      <Layout headerContent={<HeaderContent />}>
        <Form handleFormSubmit={todo => handleAddTodo(todo)} />
        <List
          items={todos}
          handleItemClick={id => toggleTodoCompleted(id)}
          handleDelete={id => deleteTodo(id)}
        />
      </Layout>
    </main>
  );
};

export default App;
