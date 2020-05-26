import React from "react";
import { render, fireEvent, waitForDomChange } from "@testing-library/react";
import App from "./App";
import { TodoContext } from "./context/todoContext";

let renderedApp: any;
const mockedAddTodo = jest.fn();
const mockedDeleteTodo = jest.fn();
const mockedToggleTodo = jest.fn();
const mockedEditTodo = jest.fn();

beforeEach(() => {
  renderedApp = () =>
    render(
      <TodoContext.Provider
        value={{
          todolist: [
            {
              id: 1,
              content: "First todo",
              completed: false
            },
            {
              id: 2,
              content: "Second todo",
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
  it("should render without crashing", () => {
    const { getAllByTestId } = render(
      <TodoContext.Provider value={{ todolist: null }}>
        <App />
      </TodoContext.Provider>
    );
    expect(getAllByTestId("List").length).toBe(1);
    expect(getAllByTestId("List")[0].children).toHaveLength(0);
  });

  it("should be able to add todo", () => {
    const { getByTestId } = renderedApp();
    fireEvent.change(getByTestId("form-input"), {
      target: { value: "Test todo" }
    });
    fireEvent.submit(getByTestId("form"));
    expect(mockedAddTodo).toHaveBeenCalledTimes(1);
    expect(mockedAddTodo).toHaveBeenCalledWith({
      completed: false,
      content: "Test todo"
    });
  });

  it("should be able to delete todo", () => {
    const { getAllByRole } = renderedApp();
    Array.from(getAllByRole("button")).forEach((button: any) => {
      fireEvent.click(button);
    });
    expect(mockedDeleteTodo).toHaveBeenCalledTimes(2);
  });

  it("should be able to toggle todo completed", () => {
    const { getAllByRole } = renderedApp();
    getAllByRole("checkbox").forEach((el: HTMLElement) => fireEvent.click(el));
    expect(mockedToggleTodo).toBeCalledTimes(2);
  });

  it("should be able to edit todo text", () => {
    const { getByText, container } = renderedApp();
    fireEvent.click(getByText(/first/i));
    waitForDomChange({ container });
    fireEvent.change(container.querySelector(".ListInput"), {
      target: { value: "Updated" }
    });
    fireEvent.submit(container.querySelector(".ListForm"));
    expect(mockedEditTodo).toHaveBeenCalledTimes(1);
  });

  it("should be able to cancel edit", () => {
    const { getByText, container } = renderedApp();
    fireEvent.click(getByText(/second/i));
    expect(container.querySelector(".ListInput").value).toBe("Second todo");
    fireEvent.click(container.querySelector(".ListForm .cancel"));
    expect(container.querySelector(".ListForm")).toBeFalsy();
  });
});
