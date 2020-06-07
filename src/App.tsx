import React, { useContext, useEffect } from "react";
import ReactGA from "react-ga";
import "./App.css";
import Layout from "./components/layout";
import List from "./components/list";
import Form from "./components/form";
import Loading from "./components/loading";
import { Todo } from "./models/todo";

import { TodoContext } from "./context/todoContext";
import { AuthContext } from "./context/authContext";

const HeaderContent = () => {
  const { logout, token } = useContext(AuthContext);
  return (
    <>
      {token && (
        <button className="Button logout" onClick={logout}>
          {" "}
          Logout
        </button>
      )}
    </>
  );
};

const App = () => {
  const { todolist, onAddTodo } = useContext(TodoContext);

  const completedTodos = todolist
    ? todolist.filter((todo: Todo) => todo.completed === true)
    : [];
  const incompleteTodos = todolist
    ? todolist.filter((todo: Todo) => todo.completed === false)
    : [];

  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, []);

  return (
    <div data-testid="App" className="App">
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
        {!todolist ? (
          <Loading loading={true} />
        ) : (
          <>
            <Form handleFormSubmit={(todo: Todo) => onAddTodo(todo)} />
            <div className="Content">
              <List title="To be done" items={incompleteTodos} />
              {completedTodos.length > 0 && (
                <List title="Done" items={completedTodos} />
              )}
            </div>
          </>
        )}
      </Layout>
    </div>
  );
};

export default App;
