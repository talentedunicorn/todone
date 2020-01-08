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
});
