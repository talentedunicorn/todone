import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { TodoContext, TodoProvider } from "./todoContext";

afterEach(() => {
  localStorage.clear();
});

const DB_NAME = process.env.REACT_APP_DB_NAME
  ? process.env.REACT_APP_DB_NAME
  : "test_db";

describe("TodoContext", () => {
  it("should render correct context", () => {
    const todolist = [1, 2, 3];
    const tree = (
      <TodoProvider value={{ todolist }}>
        <TodoContext.Consumer>
          {value => <span>There are {todolist.length} items</span>}
        </TodoContext.Consumer>
      </TodoProvider>
    );

    const { getByText } = render(tree);
    expect(getByText(/There are/i).textContent).toBe(
      `There are ${todolist.length} items`
    );
  });

  it("should add todo", async () => {
    const tree = (
      <TodoProvider>
        <TodoContext.Consumer>
          {({ todolist, onAddTodo }) => {
            const addTodo = () =>
              onAddTodo({ text: "new task", completed: false });
            return (
              <>
                <ul>
                  {todolist &&
                    todolist.map((todo, i) => <li key={i}>{todo.text}</li>)}
                </ul>
                <button data-testid="addButton" onClick={addTodo}>
                  Add todo
                </button>
              </>
            );
          }}
        </TodoContext.Consumer>
      </TodoProvider>
    );

    const { getAllByRole, getByTestId } = render(tree);
    fireEvent.click(getByTestId("addButton"));
    expect(getAllByRole("listitem")).toHaveLength(1);
  });

  it("should be able to toggle todo status", () => {
    let mockTodolist = [{ id: 1, text: "Hello", completed: false }];
    localStorage.setItem(DB_NAME, JSON.stringify(mockTodolist));
    const tree = (
      <TodoProvider>
        <TodoContext.Consumer>
          {({ todolist, toggleTodo }) => {
            return (
              <ul>
                {todolist &&
                  todolist.map((todo, i) => (
                    <li key={i}>
                      {todo.text}
                      <span>{todo.completed.toString()}</span>
                      <button onClick={() => toggleTodo(todo.id)}>
                        Toggle
                      </button>
                    </li>
                  ))}
              </ul>
            );
          }}
        </TodoContext.Consumer>
      </TodoProvider>
    );

    const { getByText } = render(tree);
    expect(getByText(/false/i).textContent).toBe("false");
    fireEvent.click(getByText(/toggle/i));
    expect(getByText(/true/i).textContent).toBe("true");
  });

  it("should be able to delete todo", () => {
    let mockTodolist = [
      { id: 1, text: "Hello world", completed: false },
      { id: 2, text: "I remain", completed: false }
    ];
    localStorage.setItem(DB_NAME, JSON.stringify(mockTodolist));
    const TestComponent = () => {
      const { todolist, deleteTodo } = React.useContext(TodoContext);
      return (
        <ul>
          {todolist &&
            todolist.map((todo, i) => (
              <li key={todo.id}>
                <span>{todo.text}</span>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </li>
            ))}
        </ul>
      );
    };
    const tree = (
      <TodoProvider>
        <TestComponent />
      </TodoProvider>
    );

    const { container } = render(tree);
    const button = container.querySelector("button");
    expect(container.querySelectorAll("li")).toHaveLength(2);
    if (button) {
      fireEvent.click(button);
    }
    expect(container.querySelectorAll("li")).toHaveLength(1);
  });

  it("should be able to edit todo", () => {
    localStorage.setItem(
      DB_NAME,
      JSON.stringify([{ id: 1, text: "Edit me", completed: false }])
    );
    const TestComponent = () => {
      const { todolist, editTodo } = React.useContext(TodoContext);
      return (
        <ul>
          {todolist &&
            todolist.map(todo => (
              <li key={todo.id}>
                <p>{todo.text}</p>
                <button onClick={_ => editTodo(todo.id, "Edited")}>Edit</button>
              </li>
            ))}
        </ul>
      );
    };
    const { getByText, getByRole } = render(
      <TodoProvider>
        <TestComponent />
      </TodoProvider>
    );
    fireEvent.click(getByRole("button"));
    expect(getByText(/edited/i)).toBeTruthy();
  });
});
