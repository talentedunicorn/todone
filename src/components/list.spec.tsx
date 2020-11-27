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

  it("should toggle expanded states", () => {
    const { getByTestId, getByRole } = render(
      <List title="Toggle expanded" items={todolist} />
    );
    expect(getByTestId("List").getAttribute("data-expanded")).toBe("true");
    fireEvent.click(getByRole("heading"));
    expect(getByTestId("List").getAttribute("data-expanded")).toBe("false");
  });

  it("should not trigger select on clicking links", () => {
    const { getByRole, queryByRole } = customRender(
      <List title="List with link" items={todolist} />
    );
    fireEvent.click(getByRole("link"));
    expect(queryByRole("form")).toBe(null);
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

  it("should edit todo", async () => {
    const { getAllByText, queryByRole } = customRender(
      <List title="Editing" items={todolist} />
    );
    expect(queryByRole("textbox")).not.toBeInTheDocument();
    fireEvent.click(getAllByText("Edit")[0]);
    expect(queryByRole("textbox")).toBeInTheDocument();
    fireEvent.change(queryByRole("textbox"), {
      target: { value: "Edited content" },
    });
    fireEvent.click(getAllByText("Save")[0]);
    await waitFor(() => {
      expect(mocks.editTodo).toHaveBeenCalledTimes(1);
    });
  });

  it("should cancel edit", async () => {
    const { getAllByText, queryByRole } = customRender(
      <List title="Cancel edit" items={todolist} />
    );
    expect(queryByRole("textbox")).not.toBeInTheDocument();
    fireEvent.click(getAllByText("Edit")[0]);
    expect(queryByRole("textbox")).toBeInTheDocument();
    fireEvent.click(getAllByText("Cancel")[0]);
    await waitFor(() => {
      expect(queryByRole("textbox")).not.toBeInTheDocument();
    });
  });

  it("should delete todo", async () => {
    const { getAllByText } = customRender(
      <List title="Deleting" items={todolist} />
    );
    expect(mocks.deleteTodo).not.toHaveBeenCalled();
    fireEvent.click(getAllByText("Delete")[0]);
    await waitFor(() => {
      expect(mocks.deleteTodo).toHaveBeenCalledTimes(1);
    });
  });
});
