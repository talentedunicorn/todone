import React from "react";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import Form from "./form";

afterEach(() => cleanup());

describe("<Form />", () => {
  it("should load without crashing", async () => {
    const { getByTestId } = render(
      <Form
        handleFormSubmit={jest.fn().mockResolvedValue(true)}
        onReset={jest.fn()}
      />
    );
    fireEvent.click(getByTestId("Toggle"));
    await waitFor(() => {
      expect(getByTestId("form")).toBeTruthy();
    });
  });

  it("should be able to submit", async () => {
    const mockHandleSubmit = jest.fn().mockResolvedValue(true);
    const testTodo = "Testing...";
    const { getByTestId } = render(
      <Form handleFormSubmit={mockHandleSubmit} onReset={jest.fn()} />
    );
    fireEvent.click(getByTestId("Toggle"));
    const input = getByTestId("form-input");
    fireEvent.change(input, { target: { value: testTodo } });
    fireEvent.submit(getByTestId("form"));
    await waitFor(() => {
      expect(mockHandleSubmit).toHaveBeenCalledWith({
        content: testTodo,
        completed: false,
      });
    });
  });

  it("should not submit todo with less than 3 characters", () => {
    const mockHandleSubmit = jest.fn().mockResolvedValue(true);
    const { getByTestId } = render(
      <Form handleFormSubmit={mockHandleSubmit} onReset={jest.fn()} />
    );
    fireEvent.click(getByTestId("Toggle"));
    fireEvent.change(getByTestId("form-input"), { target: { value: "A" } });
    fireEvent.submit(getByTestId("form"));
    expect(mockHandleSubmit).not.toHaveBeenCalled();
  });

  it("should be able to load default data", () => {
    const defaultValue = "Test default value";
    const { getByTestId } = render(
      <Form
        handleFormSubmit={jest.fn()}
        defaultValue={defaultValue}
        onReset={jest.fn()}
      />
    );
    expect(getByTestId("form-input")).toHaveTextContent(defaultValue);
  });
});
