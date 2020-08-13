import React from "react";
import { render, fireEvent } from "@testing-library/react";
import List from "./list";

describe("<List/>", () => {
  it("should render without crashing", () => {
    const { getByTestId } = render(<List items={[]} />);
    expect(getByTestId("List")).toBeTruthy();
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
