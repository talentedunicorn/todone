import React from "react";
import { render, fireEvent } from "@testing-library/react";
import List from "./list";
import { TodoProvider } from "../context/todoContext";

describe("<List/>", () => {
  it("should render without crashing", () => {
    const { getByTestId } = render(
      <TodoProvider>
        <List items={[]} />
      </TodoProvider>
    );
    expect(getByTestId("List")).toBeTruthy();
  });

  it("should render list sorted latest first", () => {
    const testTodos = [
      { id: 1, text: "First todo", completed: false },
      { id: 2, text: "Second todo", completed: false },
      { id: 3, text: "Third todo", completed: false }
    ];
    const { getAllByRole } = render(
      <TodoProvider>
        <List items={testTodos} />
      </TodoProvider>
    );
    expect(getAllByRole("listitem")[0].textContent).toContain("Third todo");
  });

  it("should not trigger select on clicking links", () => {
    const todos = [
      { id: 1, text: "Click [me](https://google.com)", completed: false }
    ];
    const { getByRole, queryByRole } = render(
      <TodoProvider>
        <List items={todos} />
      </TodoProvider>
    );
    fireEvent.click(getByRole("link"));
    expect(queryByRole("form")).toBe(null);
  });
});
