import React, { useContext, useEffect, useState } from "react";
import List from "./components/list";
import Form from "./components/form";
import Loading from "./components/loading";
import { Todo } from "./models/todo";

import Styles from "./App.module.css";

import { TodoContext } from "./context/todoContext";
import { AuthContext } from "./context/authContext";
import { exportData } from "./services/localStorage";

const App = () => {
  const [loading, setLoading] = useState(true);
  const { todolist, onAddTodo, getTodos } = useContext(TodoContext);
  const { logout, token } = useContext(AuthContext);

  const completedTodos = todolist
    ? todolist.filter((todo: Todo) => todo.completed === true)
    : [];
  const incompleteTodos = todolist
    ? todolist.filter((todo: Todo) => todo.completed === false)
    : [];

  useEffect(() => {
    const isAuthorized = token || process.env.REACT_APP_OFFLINE_MODE;
    async function initialLoad() {
      try {
        if (isAuthorized && !todolist) {
          await getTodos(token);
        }
      } catch (error) {
        if (error.response.status && error.response.status === 401) {
          logout();
        }
      }

      setLoading(false);
    }

    initialLoad();
  }, [token, getTodos, todolist, logout]);

  return (
    <main data-testid="App" className={Styles.Layout}>
      <header className={Styles.Header}>
        <h1 className={Styles.Logo}>{process.env.REACT_APP_WEBSITE_NAME}</h1>
        <a
          className={Styles.Hint}
          title="This app uses Markdown. Click to learn how to use it"
          target="blank"
          href="https://www.markdownguide.org/cheat-sheet"
        >
          Markdown cheatsheet
        </a>
        {process.env.REACT_APP_OFFLINE_MODE && (
          <button
            title="Save to file"
            className={Styles.Export}
            disabled={!todolist || todolist.length < 1}
            onClick={_ => exportData()}
          >
            Save to file
          </button>
        )}
        {!process.env.REACT_APP_OFFLINE_MODE && token && (
          <button className={Styles.Logout} onClick={logout}>
            {" "}
            Logout
          </button>
        )}
      </header>
      {loading ? (
        <Loading className={Styles.Loading} />
      ) : (
        <>
          <Form handleFormSubmit={(todo: Todo) => onAddTodo(todo, token)} />
          <div className={Styles.LayoutContent}>
            <List title="To be done" items={incompleteTodos} />
            {completedTodos.length > 0 && (
              <List title="Done" items={completedTodos} />
            )}
          </div>
        </>
      )}
      <footer className={Styles.Footer}>
        <p>
          Made with{" "}
          <span role="img" aria-label="heart">
            ❤️
          </span>{" "}
          by <a href="https://talentedunicorn.com">TalentedUnicorn</a>{" "}
          <sup>&copy;</sup>&nbsp;{new Date().getFullYear()}.
        </p>
      </footer>
    </main>
  );
};

export default App;
