import React, { useContext } from "react";
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

const RenderedList = ({ title, data }: any) => (
  <div>
    <h3 data-testid="completed-list-title" className="SectionTitle">
      {title}
    </h3>
    <List items={data} />
  </div>
);

const App = () => {
  const { todolist, onAddTodo } = useContext(TodoContext);

  const completedTodos = todolist
    ? todolist.filter((todo: Todo) => todo.completed === true)
    : [];
  const incompleteTodos = todolist
    ? todolist.filter((todo: Todo) => todo.completed === false)
    : [];

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
            <div className="App-Content">
              <RenderedList title="To be done" data={incompleteTodos} />
              {completedTodos.length > 0 && (
                <RenderedList title="Done" data={completedTodos} />
              )}
            </div>
          </>
        )}
      </Layout>
    </div>
  );
};

export default App;
