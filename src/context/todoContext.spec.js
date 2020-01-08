import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { TodoContext, TodoProvider } from "./todoContext";

afterEach(() => {
  localStorage.clear();
});

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

  it("should add todo", () => {
    const testTodo = {
      text: "Test todo",
      completed: false
    };

    const tree = (
      <TodoProvider>
        <TodoContext.Consumer>
          {({ onAddTodo, todolist }) => (
            <div>
              <p>There are {todolist.length} todos</p>
              <button onClick={() => onAddTodo(testTodo)}>Add todo</button>
            </div>
          )}
        </TodoContext.Consumer>
      </TodoProvider>
    );
    const { getByText, debug } = render(tree);
    expect(getByText(/There are/i).textContent).toContain("0");
    fireEvent.click(getByText(/add/i));
    expect(getByText(/There are/i).textContent).toContain("1");
  });

  it("should be able to toggle todo status", () => {
    let mockTodolist = [{ id: 1, text: "Hello", completed: false }];
    localStorage.setItem(
      process.env.REACT_APP_DB_NAME,
      JSON.stringify(mockTodolist)
    );
    const tree = (
      <TodoProvider>
        <TodoContext.Consumer>
          {({ todolist, toggleTodo }) => {
            return (
              <ul>
                {todolist.map((todo, i) => (
                  <li key={i}>
                    {todo.text}
                    <span>{todo.completed.toString()}</span>
                    <button onClick={() => toggleTodo(todo.id)}>Toggle</button>
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
    localStorage.setItem(
      process.env.REACT_APP_DB_NAME,
      JSON.stringify(mockTodolist)
    );
    const TestComponent = _ => {
      const { todolist, deleteTodo } = React.useContext(TodoContext);
      return (
        <ul>
          {todolist.map((todo, i) => (
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
    expect(container.querySelectorAll("li")).toHaveLength(2);
    fireEvent.click(container.querySelector("button"));
    expect(container.querySelectorAll("li")).toHaveLength(1);
  });
});
