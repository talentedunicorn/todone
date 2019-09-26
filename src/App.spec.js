import React, { useState } from "react";
import { render, fireEvent } from "@testing-library/react";
import App from "./App";
import { get } from "http";

function addTodo(getByTestId, value) {
  fireEvent.change(getByTestId("form-input"), { target: { value } });
  fireEvent.submit(getByTestId("form"));
}

describe("<App/>", () => {
  it("renders without crashing", () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId("App")).toBeTruthy();
  });

  it("should be able to add todo", () => {
    const { getByTestId, getAllByText, debug } = render(<App />);
    addTodo(getByTestId, "Test todo");
    expect(getAllByText(/Test todo/i)).toHaveLength(1);
  });

  it("should be able to delete todo", () => {
    const { queryByText, getByTestId } = render(<App />);
    addTodo(getByTestId, "Testing todo");
    fireEvent.click(queryByText(/delete/i));
    expect(queryByText(/Testing todo/i)).toBeFalsy();
  });

  it("should be able to toggle todo completed", () => {
    const { getByTestId, getByText } = render(<App />);
    addTodo(getByTestId, "Testing todo");
    fireEvent.click(getByText(/Testing todo/i));
    expect(getByText(/Testing todo/i).dataset.completed).toBeTruthy();
  });

  it("should be able to clear completed todos after confirm", () => {
    global.confirm = () => true;
    const { getByTestId, getAllByText, getByText, queryByTestId } = render(
      <App />
    );
    addTodo(getByTestId, "New todo");
    addTodo(getByTestId, "Another new todo");
    addTodo(getByTestId, "One more todo");

    const todos = getAllByText(/New todo/i);
    todos.forEach(todo => fireEvent.click(todo));
    expect(getByTestId("completed-list-title")).toBeTruthy();

    fireEvent.click(getByTestId("clear-completed-button"));

    expect(queryByTestId("completed-list-title")).toBeFalsy();
  });
});
