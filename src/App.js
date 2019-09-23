import React, { useState, useEffect } from "react";
import "./App.css";
import Layout from "./components/layout";
import List from "./components/list";
import Form from "./components/form";

const HeaderContent = ({ clear, cache }) => (
  <>
    <button onClick={clear}>Clear completed</button>
    <button onClick={cache}>Sync</button>
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

  const clearCompletedTodos = _ => {
    if (completedTodos.length > 0) {
      window.confirm("Clear all completed todos?") &&
        setTodos(todos.filter(todo => todo.completed === false));
    }
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
      setTodos(JSON.parse(cachedTodos));
    }
  }, []);

  const completedTodos = todos.filter(todo => todo.completed === true);
  const incompleteTodos = todos.filter(todo => todo.completed === false);

  return (
    <main data-testid="App">
      <Layout
        headerContent={
          <HeaderContent
            clear={clearCompletedTodos}
            cache={_ => cacheTodos()}
          />
        }
      >
        <Form handleFormSubmit={todo => handleAddTodo(todo)} />
        <List
          items={incompleteTodos}
          handleItemClick={id => toggleTodoCompleted(id)}
          handleDelete={id => deleteTodo(id)}
        />

        {completedTodos.length > 0 && (
          <>
            <h3>Completed</h3>
            <List
              items={completedTodos}
              handleItemClick={id => toggleTodoCompleted(id)}
              handleDelete={id => deleteTodo(id)}
            />
          </>
        )}
      </Layout>
    </main>
  );
};

export default App;
