import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import { TodoContext } from "./context/todoContext";
import { todolist } from "./test-utils/mocks";
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
          todolist,
          onAddTodo: mockedAddTodo,
          deleteTodo: mockedDeleteTodo,
          toggleTodo: mockedToggleTodo,
          editTodo: mockedEditTodo,
          getTodos: jest.fn().mockResolvedValue(todolist),
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
    expect(getAllByTestId("App").length).toBeInTheDocument;
  });

  it("should be able to add todo", async () => {
    const { getByTestId } = renderedApp();
    fireEvent.change(getByTestId("form-input"), {
      target: { value: "Test todo" },
    });
    fireEvent.submit(getByTestId("form"));
    expect(mockedAddTodo).toHaveBeenCalledTimes(1);
  });

  it("should be able to delete todo", async () => {
    const { getAllByText } = renderedApp();
    fireEvent.click(getAllByText(/delete/i)[0]);
    await waitFor(() => expect(mockedDeleteTodo).toHaveBeenCalledTimes(1));
  });

  it("should be able to toggle todo completed", async () => {
    const { getAllByRole } = renderedApp();
    const checkbox = getAllByRole("checkbox")[0];
    fireEvent.click(checkbox);
    await waitFor(() => expect(checkbox));
    expect(mockedToggleTodo).toBeCalledTimes(1);
  });

  it("should be able to edit todo text", async () => {
    const { container } = renderedApp();
    fireEvent.click(container.querySelector(".ListEdit"));
    fireEvent.change(container.querySelector(".ListInput"), {
      target: { value: "Updated" },
    });
    fireEvent.submit(container.querySelector(".ListForm"));
    await waitFor(() => container.querySelector(".ListForm"));
    expect(mockedEditTodo).toHaveBeenCalledTimes(1);
  });

  it("should be able to cancel edit", async () => {
    const { container } = renderedApp();
    fireEvent.click(container.querySelector(".ListEdit"));
    await waitFor(() => container.querySelector(".ListForm"));
    expect(container.querySelector(".ListInput").value).toBe("First todo");
    fireEvent.click(container.querySelector(".ListCancel"));
    await waitFor(() => container.querySelector(".ListInput"));
    expect(container.querySelector(".ListForm")).toBeFalsy();
  });
});
