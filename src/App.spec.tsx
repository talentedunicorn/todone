import React from "react";
import { render, fireEvent, wait } from "@testing-library/react";
import App from "./App";
import { TodoContext } from "./context/todoContext";

let renderedApp: any;
const mockedAddTodo = jest.fn().mockResolvedValue(true);
const mockedDeleteTodo = jest.fn().mockResolvedValue(true);
const mockedToggleTodo = jest.fn().mockResolvedValue(true);
const mockedEditTodo = jest.fn().mockResolvedValue(true);

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
    expect(getAllByTestId("Loading").length).toBe(1);
  });

  it("should be able to add todo", async () => {
    const { getByTestId } = renderedApp();
    fireEvent.change(getByTestId("form-input"), {
      target: { value: "Test todo" }
    });
    fireEvent.submit(getByTestId("form"));
    expect(mockedAddTodo).toHaveBeenCalledTimes(1);
  });

  it("should be able to delete todo", async () => {
    const { getAllByText } = renderedApp();
    await wait(() => fireEvent.click(getAllByText(/delete/i)[0]));
    expect(mockedDeleteTodo).toHaveBeenCalledTimes(1);
  });

  it("should be able to toggle todo completed", async () => {
    const { getAllByRole } = renderedApp();
    await wait(() => fireEvent.click(getAllByRole("checkbox")[0]));
    expect(mockedToggleTodo).toBeCalledTimes(1);
  });

  it("should be able to edit todo text", async () => {
    const { getByText, container } = renderedApp();
    await wait(() => {
      fireEvent.click(getByText(/first/i));
      fireEvent.change(container.querySelector(".ListInput"), {
        target: { value: "Updated" }
      });
      fireEvent.submit(container.querySelector(".ListForm"));
    });
    expect(mockedEditTodo).toHaveBeenCalledTimes(1);
  });

  it("should be able to cancel edit", async () => {
    const { getByText, container, debug } = renderedApp();
    await wait(() => fireEvent.click(getByText(/second/i)));
    expect(container.querySelector(".ListInput").value).toBe("Second todo");
    await wait(() => fireEvent.click(container.querySelector(".ListCancel")));
    expect(container.querySelector(".ListForm")).toBeFalsy();
  });
});
