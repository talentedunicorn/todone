import React from "react";
import { render, fireEvent } from "@testing-library/react";
import List from "./list";
import { TodoProvider } from "../context/todoContext";

describe("<List/>", () => {
  it("should render without crashing", () => {
    const { getByTestId } = render(
      <TodoProvider>
        <List />
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
});
