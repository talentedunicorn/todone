import React from "react";
import {
  render,
  fireEvent,
  cleanup,
  waitFor,
  wait,
} from "@testing-library/react";
import List from "./list";
import { TodoContext } from "../context/todoContext";
import { todolist } from "../test-utils/mocks";

const mocks = {
  todolist,
  toggleTodo: jest.fn(),
  selectTodo: jest.fn(),
  editTodo: jest.fn(),
  deleteTodo: jest.fn(),
};

afterEach(() => {
  cleanup();
});

const customRender = (ui: any) => {
  return render(
    <TodoContext.Provider value={mocks}>{ui}</TodoContext.Provider>
  );
};

describe("<List/>", () => {
  it("should render an empty list", () => {
    const { getByTestId } = render(<List title="Test list" items={[]} />);
    expect(getByTestId("List")).toBeInTheDocument();
  });

  it("should render items sorted by updated descending", () => {
    const { getAllByRole, debug } = render(
      <List title="Todos" items={todolist} />
    );
    expect(getAllByRole("listitem")[0]).toHaveTextContent("Updated last");
  });

  it("should toggle expanded states", () => {
    const { getByTestId, getByRole } = render(
      <List title="Toggle expanded" items={todolist} />
    );
    expect(getByTestId("List").getAttribute("data-expanded")).toBe("true");
    fireEvent.click(getByRole("heading"));
    expect(getByTestId("List").getAttribute("data-expanded")).toBe("false");
  });

  it("should toggle todo", async () => {
    const { getAllByRole } = customRender(
      <List title="Toggle items" items={todolist} />
    );
    expect(getAllByRole("checkbox")[0]).not.toBeChecked();
    fireEvent.click(getAllByRole("checkbox")[0]);
    await waitFor(() => {
      expect(mocks.toggleTodo).toHaveBeenCalledTimes(1);
    });
  });

  it("should start edit todo", async () => {
    const { getAllByText, queryByRole } = customRender(
      <List title="Editing" items={todolist} />
    );
    expect(queryByRole("textbox")).not.toBeInTheDocument();
    fireEvent.click(getAllByText("Edit")[0]);
    expect(mocks.selectTodo).toHaveBeenCalledTimes(1);
  });

  it("should delete todo", async () => {
    global.window.confirm = jest.fn().mockReturnValue(true);
    const { getAllByText } = customRender(
      <List title="Deleting" items={todolist} />
    );
    expect(mocks.deleteTodo).not.toHaveBeenCalled();
    fireEvent.click(getAllByText("Delete")[0]);
    await waitFor(() => {
      expect(global.window.confirm).toHaveBeenCalledTimes(1);
      expect(mocks.deleteTodo).toHaveBeenCalledTimes(1);
    });
  });
});
