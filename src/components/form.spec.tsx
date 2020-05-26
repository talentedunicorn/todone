import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import Form from "./form";

afterEach(() => cleanup());

describe("<Form />", () => {
  it("should load without crashing", () => {
    const { getByTestId } = render(<Form />);
    expect(getByTestId("form")).toBeTruthy();
  });

  it("should be able to add todo and clear input", () => {
    const mockHandleSubmit = jest.fn();
    const testTodo = "Testing...";
    const { getByTestId } = render(
      <Form handleFormSubmit={mockHandleSubmit} />
    );
    const input = getByTestId("form-input");
    fireEvent.change(input, { target: { value: testTodo } });
    fireEvent.submit(getByTestId("form"));
    expect(mockHandleSubmit).toHaveBeenCalledWith({
      content: testTodo,
      completed: false
    });
    expect(input.textContent).toBe("");
  });

  it("should not add todo with less than 3 characters", () => {
    const mockHandleSubmit = jest.fn();
    const { getByTestId } = render(
      <Form handleFormSubmit={mockHandleSubmit} />
    );
    fireEvent.change(getByTestId("form-input"), { target: { value: "A" } });
    fireEvent.submit(getByTestId("form"));
    expect(mockHandleSubmit).not.toHaveBeenCalled();
  });
});
