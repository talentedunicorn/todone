import React from "react";
import { render, fireEvent } from "@testing-library/react";
import App from "./App";
import { TodoContext } from "./context/todoContext";

let renderedApp;
const mockedAddTodo = jest.fn();
const mockedDeleteTodo = jest.fn();
const mockedToggleTodo = jest.fn();

beforeEach(() => {
  renderedApp = _ =>
    render(
      <TodoContext.Provider
        value={{
          todolist: [
            {
              id: 1,
              text: "First todo",
              completed: false
            },
            {
              id: 2,
              text: "Second todo",
              completed: true
            }
          ],
          getList: jest.fn(),
          onAddTodo: mockedAddTodo,
          deleteTodo: mockedDeleteTodo,
          toggleTodo: mockedToggleTodo
        }}
      >
        <App />
      </TodoContext.Provider>
    );
});

describe("<App/>", () => {
  it("should be able to add todo", () => {
    const { getByTestId } = renderedApp();
    fireEvent.change(getByTestId("form-input"), {
      target: { value: "Test todo" }
    });
    fireEvent.submit(getByTestId("form"));
    expect(mockedAddTodo).toHaveBeenCalledTimes(1);
    expect(mockedAddTodo).toHaveBeenCalledWith({
      completed: false,
      text: "Test todo"
    });
  });

  it("should be able to delete todo", () => {
    const { queryByText } = renderedApp();
    fireEvent.click(queryByText(/delete/i));
    expect(mockedDeleteTodo).toHaveBeenCalledTimes(1);
    expect(mockedDeleteTodo).toHaveBeenCalledWith(1);
  });

  it("should be able to toggle todo completed", () => {
    const { getByText } = renderedApp();
    expect(getByText(/Second todo/i).dataset.completed).toBe("true");
    fireEvent.click(getByText(/Second todo/i));
    expect(mockedToggleTodo).toBeCalledTimes(1);
    expect(mockedToggleTodo).toHaveBeenCalledWith(2);
  });
});
