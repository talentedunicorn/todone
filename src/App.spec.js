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
    const { getAllByText } = renderedApp();
    Array.from(getAllByText(/delete/i)).forEach(button =>
      fireEvent.click(button)
    );
    expect(mockedDeleteTodo).toHaveBeenCalledTimes(2);
    expect(mockedDeleteTodo).toHaveBeenLastCalledWith(2);
  });

  it("should be able to toggle todo completed", () => {
    const { getByText, debug } = renderedApp();
    fireEvent.click(getByText(/First todo/i));
    fireEvent.click(getByText(/Second todo/i));
    expect(mockedToggleTodo).toBeCalledTimes(2);
    expect(mockedToggleTodo).toHaveBeenLastCalledWith(2);
  });
});
