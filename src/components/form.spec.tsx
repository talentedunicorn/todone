import React from "react";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import Form from "./form";
import CodeMirror from "codemirror";

// Workaround: https://github.com/jsdom/jsdom/issues/3002
document.createRange = () => {
  const range = new Range();

  range.getBoundingClientRect = jest.fn();

  range.getClientRects = () => {
    return {
      item: () => null,
      length: 0,
      [Symbol.iterator]: jest.fn(),
    };
  };

  return range;
};

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

  // Unable to properly test Codemirror setters
  xit("should be able to submit", async () => {
    const mockHandleSubmit = jest.fn().mockResolvedValue(true);
    const content = "Testing...";
    const { getByTestId } = render(
      <Form
        handleFormSubmit={mockHandleSubmit}
        onReset={jest.fn()}
        defaultValue={content}
      />
    );
    fireEvent.click(getByTestId("Toggle"));

    const input = getByTestId("form-input") as HTMLTextAreaElement;
    const editor = CodeMirror.fromTextArea(input);
    editor.getDoc().setValue(content);
    // fireEvent.change(input, { target: { value: content } });
    fireEvent.click(getByTestId("submit"));
    await waitFor(() => {
      expect(mockHandleSubmit).toHaveBeenCalledWith({
        content: content,
        completed: false,
      });
    });
  });

  it("should not submit empty data", () => {
    const mockHandleSubmit = jest.fn().mockResolvedValue(true);
    const { getByTestId } = render(
      <Form handleFormSubmit={mockHandleSubmit} onReset={jest.fn()} />
    );
    fireEvent.click(getByTestId("Toggle"));
    fireEvent.change(getByTestId("form-input"), { target: { value: "" } });
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
    expect(getByTestId("form")).toHaveTextContent(defaultValue);
  });
});
