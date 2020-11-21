import React from "react";
import { render, fireEvent, cleanup, waitFor } from "@testing-library/react";
import List from "./list";
import { TodoProvider } from "../context/todoContext";

const todolist = [
  {
    id: 1,
    content: "Click [me](https://google.com)",
    completed: false,
    created_at: Date.now(),
    updated_at: Date.now(),
  },
  {
    id: 2,
    content: "More content",
    completed: false,
    created_at: Date.now(),
    updated_at: Date.now(),
  },
];

afterEach(() => {
  cleanup();
});

describe("<List/>", () => {
  it("should render an empty list", () => {
    const { getByTestId } = render(<List title="Test list" items={[]} />);
    expect(getByTestId("List")).toBeTruthy();
  });

  it("should not trigger select on clicking links", () => {
    const { getByRole, queryByRole } = render(
      <TodoProvider value={todolist}>
        <List title="Test list" items={todolist} />
      </TodoProvider>
    );
    fireEvent.click(getByRole("link"));
    expect(queryByRole("form")).toBe(null);
  });
});
