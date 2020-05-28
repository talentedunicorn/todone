import React from "react";
import { render, fireEvent } from "@testing-library/react";
import List from "./list";

describe("<List/>", () => {
  it("should render without crashing", () => {
    const { getByTestId } = render(<List items={[]} />);
    expect(getByTestId("List")).toBeTruthy();
  });

  it("should render list sorted latest first", () => {
    const testTodos = [
      { id: 1, content: "First todo", completed: false },
      { id: 2, content: "Second todo", completed: false },
      { id: 3, content: "Third todo", completed: false }
    ];
    const { getAllByRole } = render(<List items={testTodos} />);
    expect(getAllByRole("listitem")[0].textContent).toContain("Third todo");
  });

  it("should not trigger select on clicking links", () => {
    const todos = [
      { id: 1, content: "Click [me](https://google.com)", completed: false }
    ];
    const { getByRole, queryByRole } = render(<List items={todos} />);
    fireEvent.click(getByRole("link"));
    expect(queryByRole("form")).toBe(null);
  });
});
