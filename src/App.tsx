import React, { useContext, useEffect, useState } from "react";
import List from "./components/list";
import Form from "./components/form";
import Loading from "./components/loading";
import { Todo } from "./models/todo";

import Styles from "./App.module.css";

import { TodoContext } from "./context/todoContext";
import { AuthContext } from "./context/authContext";
import { NotificationContext } from "./context/notificationContext";
import { exportData } from "./services/localStorage";
import * as serviceWorker from "./serviceWorker";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<any>();
  const { todolist, onAddTodo, getTodos } = useContext(TodoContext);
  const { logout } = useContext(AuthContext);
  const { notify } = useContext(NotificationContext);
  const OFFLINE_MODE = process.env.REACT_APP_OFFLINE_MODE;

  const completedTodos = todolist
    ? todolist.filter((todo: Todo) => todo.completed === true)
    : [];
  const incompleteTodos = todolist
    ? todolist.filter((todo: Todo) => todo.completed === false)
    : [];

  useEffect(() => {
    function onServiceWorkerUpdate(registration: any) {
      registration && setWaitingWorker(registration.waiting);
      setHasUpdate(true);
    }

    function updateServiceWorker() {
      waitingWorker && waitingWorker.postMessage({ type: "SKIP_WAITING" });
      setHasUpdate(false);
      window.location.reload();
    }

    async function initialLoad() {
      try {
        if (!todolist) {
          await getTodos();
        }
      } catch (error) {
        if (error.response?.status && error.response?.status === 401) {
          logout();
        }
      }
      setLoading(false);
    }

    if (process.env.NODE_ENV === "production") {
      setHasUpdate(false);
      serviceWorker.register({ onUpdate: onServiceWorkerUpdate });
    }

    if (hasUpdate) {
      notify("A new version is available", null, {
        text: "Reload",
        callback: updateServiceWorker,
      });
    }

    initialLoad();
  }, [getTodos, todolist, logout, hasUpdate, notify, waitingWorker]);

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
        {OFFLINE_MODE === "true" ? (
          <button
            title="Save to file"
            className={Styles.Export}
            disabled={!todolist || todolist.length < 1}
            onClick={(_) => exportData()}
          >
            Save to file
          </button>
        ) : (
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
          <Form handleFormSubmit={(todo: Todo) => onAddTodo(todo)} />
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
