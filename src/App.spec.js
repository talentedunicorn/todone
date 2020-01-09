import React from "react";
import { render, fireEvent, waitForDomChange } from "@testing-library/react";
import App from "./App";
import { TodoContext } from "./context/todoContext";

let renderedApp;
const mockedAddTodo = jest.fn();
const mockedDeleteTodo = jest.fn();
const mockedToggleTodo = jest.fn();
const mockedEditTodo = jest.fn();

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
          onAddTodo: mockedAddTodo,
          deleteTodo: mockedDeleteTodo,
          toggleTodo: mockedToggleTodo,
          editTodo: mockedEditTodo
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
    const { getAllByRole } = renderedApp();
    Array.from(getAllByRole("button")).forEach(button => {
      fireEvent.click(button);
    });
    expect(mockedDeleteTodo).toHaveBeenCalledTimes(2);
  });

  it("should be able to toggle todo completed", () => {
    const { getAllByRole } = renderedApp();
    getAllByRole("checkbox").forEach(el => fireEvent.click(el));
    expect(mockedToggleTodo).toBeCalledTimes(2);
  });

  it("should be able to edit todo text", () => {
    const { getByText, container } = renderedApp();
    fireEvent.click(getByText(/first/i));
    waitForDomChange({ container });
    fireEvent.change(container.querySelector("li form input"), {
      target: { value: "Updated" }
    });
    fireEvent.submit(container.querySelector("li form"));
    expect(mockedEditTodo).toHaveBeenCalledTimes(1);
  });

  it("should be able to cancel edit", () => {
    const { getByText, container } = renderedApp();
    fireEvent.click(getByText(/second/i));
    expect(container.querySelector("li form input").value).toBe("Second todo");
    fireEvent.click(container.querySelector("li form .cancel"));
    expect(container.querySelector("li form")).toBeFalsy();
  });
});
