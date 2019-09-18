import React, { useState, useEffect } from "react";
import "./App.css";
import Layout from "./components/layout";
import List from "./components/list";
import Form from "./components/form";

const fakeTodos = [
  { id: 1, text: "Refactor todo", completed: true },
  { id: 2, text: "Write tests", completed: false },
  { id: 3, text: "Deploy something new", completed: false }
];

const HeaderContent = _ => (
  <>
    <button>Clear</button>
  </>
);

const App = _ => {
  const [todos, setTodos] = useState([]);

  const toggleTodo = id => {
    console.log("toggle todo...");
  };

  const deleteTodo = id => console.log("Delete todo: " + id);

  const handleAddTodo = todo => console.log(`Adding todo: ${todo}`);

  useEffect(() => {
    // fetch todos
    setTodos(fakeTodos);
  }, []);

  return (
    <main data-testid="App">
      <Layout headerContent={<HeaderContent />}>
        <Form addTodo={todo => handleAddTodo(todo)} />
        <List
          items={todos}
          handleItemClick={id => toggleTodo(id)}
          handleDelete={id => deleteTodo(id)}
        />
      </Layout>
    </main>
  );
};

export default App;
