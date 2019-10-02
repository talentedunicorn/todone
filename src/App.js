import React, { useState, useEffect } from "react";
import "./App.css";
import Layout from "./components/layout";
import List from "./components/list";
import Form from "./components/form";

const HeaderContent = ({ clear, cache }) => (
  <>
    <button
      data-testid="clear-completed-button"
      onClick={clear}
      className="Button Button-icon clear"
    >
      Clear completed
    </button>
    <button onClick={cache} className="Button Button-icon sync">
      Sync
    </button>
  </>
);

const App = _ => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

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

  const editTodo = id => {
    const todo = todos.find(todo => todo.id === id);
    setText(todo.text);
  };

  const handleAddTodo = e => {
    e.preventDefault();

    if (text.trim().length < 3) {
      return false;
    }

    const todo = {
      id: new Date().getTime(),
      text: text,
      completed: false
    };

    setTodos([...todos, todo]);
    setText("");
  };

  const handleFormChange = formInput => {
    setText(formInput);
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
    <main data-testid="App" className="App">
      <Layout
        headerContent={
          <HeaderContent
            clear={clearCompletedTodos}
            cache={_ => cacheTodos()}
          />
        }
        footerContent={
          <>
            <p>
              Made with{" "}
              <span role="img" aria-label="heart">
                ❤️
              </span>{" "}
              by <a href="https://talentedunicorn.com">TalentedUnicorn</a>{" "}
              <sup>&copy;</sup>&nbsp;{new Date().getFullYear()}.
            </p>
          </>
        }
      >
        <Form
          text={text}
          formChange={handleFormChange}
          formSubmit={handleAddTodo}
        />
        <List
          items={incompleteTodos}
          handleItemClick={id => toggleTodoCompleted(id)}
          handleDelete={id => deleteTodo(id)}
          handleEdit={id => editTodo(id)}
        />

        {completedTodos.length > 0 && (
          <>
            <h3 data-testid="completed-list-title" className="SectionTitle">
              Completed
            </h3>
            <List
              items={completedTodos}
              handleItemClick={id => toggleTodoCompleted(id)}
            />
          </>
        )}
      </Layout>
    </main>
  );
};

export default App;
