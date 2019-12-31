import React, { useContext, useEffect } from "react";
import "./App.css";
import Layout from "./components/layout";
import List from "./components/list";
import Form from "./components/form";

import { TodoContext } from "./context/todoContext";

const HeaderContent = _ => (
  <p>
    <a
      href="//github.com/talentedunicorn/todolist"
      style={{ "--icon": "var(--icon-github)" }}
      className="Button-icon"
    >
      <span className="visually-hidden">Source Code</span>
    </a>
  </p>
);

const App = _ => {
  const { todolist, getList, toggleTodo, deleteTodo, onAddTodo } = useContext(
    TodoContext
  );

  useEffect(() => {
    getList();
  }, [getList]);

  const completedTodos = todolist.filter(todo => todo.completed === true);
  const incompleteTodos = todolist.filter(todo => todo.completed === false);

  return (
    <main data-testid="App" className="App">
      <Layout
        headerContent={<HeaderContent />}
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
        <Form handleFormSubmit={todo => onAddTodo(todo)} />
        <List
          items={incompleteTodos}
          handleItemClick={id => toggleTodo(id)}
          handleDelete={id => deleteTodo(id)}
        />

        {completedTodos.length > 0 && (
          <>
            <h3 data-testid="completed-list-title" className="SectionTitle">
              Completed
            </h3>
            <List
              items={completedTodos}
              handleItemClick={id => toggleTodo(id)}
              handleDelete={id => deleteTodo(id)}
            />
          </>
        )}
      </Layout>
    </main>
  );
};

export default App;
