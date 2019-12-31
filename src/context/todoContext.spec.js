import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { TodoContext, TodoProvider } from "./todoContext";

afterEach(() => {
  localStorage.clear();
  cleanup();
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
    localStorage.setItem("test", JSON.stringify(mockTodolist));
    const tree = (
      <TodoProvider>
        <TodoContext.Consumer>
          {({ todolist, toggleTodo, getList }) => {
            return (
              <>
                <button onClick={getList}>Get list</button>
                <ul>
                  {todolist.map((todo, i) => (
                    <li key={i}>
                      {todo.text}
                      <span>{todo.completed.toString()}</span>
                      <button onClick={() => toggleTodo(todo.id)}>
                        Toggle
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            );
          }}
        </TodoContext.Consumer>
      </TodoProvider>
    );

    const { getByText } = render(tree);
    fireEvent.click(getByText(/get/i));
    expect(getByText(/false/i).textContent).toBe("false");
    fireEvent.click(getByText(/toggle/i));
    expect(getByText(/true/i).textContent).toBe("true");
  });

  it("should be able to delete todo", () => {
    let mockTodolist = [{ id: 1, text: "Hello", completed: false }];
    localStorage.setItem("test", JSON.stringify(mockTodolist));
    const tree = (
      <TodoProvider>
        <TodoContext.Consumer>
          {({ todolist, deleteTodo, getList }) => {
            return (
              <>
                <button onClick={getList}>Get list</button>
                <ul>
                  {todolist.map((todo, i) => (
                    <li key={i}>
                      <span>{todo.text}</span>
                      <button onClick={() => deleteTodo(todo.id)}>
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            );
          }}
        </TodoContext.Consumer>
      </TodoProvider>
    );

    const { getByText, queryByText, debug } = render(tree);
    fireEvent.click(getByText(/get/i));
    expect(getByText(/hello/i).textContent).toEqual(mockTodolist[0].text);
    fireEvent.click(getByText(/delete/i));
    expect(queryByText(/hello/i)).toBeFalsy();
  });
});
