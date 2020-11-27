import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  wait,
  cleanup,
} from "@testing-library/react";
import App from "./App";
import { TodoContext } from "./context/todoContext";
import { todolist } from "./test-utils/mocks";
import { AuthContext } from "./context/authContext";

jest.mock("./services/localStorage");
const mockedService = require("./services/localStorage");

afterEach(() => cleanup());

describe("<App/>", () => {
  it("should render without crashing", () => {
    const { getAllByTestId } = render(
      <TodoContext.Provider value={{ todolist: null }}>
        <App />
      </TodoContext.Provider>
    );
    expect(getAllByTestId("App").length).toBeInTheDocument;
  });

  it("should add todo", async () => {
    const onAddTodo = jest.fn();
    const { getByTestId } = render(
      <TodoContext.Provider
        value={{ todolist, onAddTodo, getTodos: jest.fn() }}
      >
        <App />
      </TodoContext.Provider>
    );
    fireEvent.change(getByTestId("form-input"), {
      target: { value: "Test todo" },
    });
    fireEvent.submit(getByTestId("form"));
    expect(onAddTodo).toHaveBeenCalledTimes(1);
  });

  it("should log user out on error", async () => {
    const logout = jest.fn();
    const getTodos = jest.fn().mockRejectedValue({ response: { status: 401 } });
    render(
      <AuthContext.Provider value={{ logout }}>
        <TodoContext.Provider value={{ getTodos }}>
          <App />
        </TodoContext.Provider>
      </AuthContext.Provider>
    );
    await waitFor(() => {
      expect(logout).toHaveBeenCalledTimes(1);
    });
  });

  it("should export data", async () => {
    process.env.REACT_APP_OFFLINE_MODE = "true";
    mockedService.exportData = jest.fn();
    const { getByText } = render(
      <TodoContext.Provider value={{ todolist }}>
        <App />
      </TodoContext.Provider>
    );
    fireEvent.click(getByText(/Save to file/));
    await waitFor(() => {
      expect(mockedService.exportData).toHaveBeenCalledTimes(1);
    });
  });
});
