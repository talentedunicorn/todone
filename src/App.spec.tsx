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
import { NotificationProvider } from "./context/notificationContext";

jest.mock("./services/localStorage");
const mockedService = require("./services/localStorage");

let contextMock;

beforeEach(() => {
  contextMock = {
    todolist,
    onAddTodo: jest.fn(),
    getTodos: jest.fn(),
    selectTodo: jest.fn(),
  };
});

afterEach(() => cleanup());

describe("<App/>", () => {
  it("should render without crashing", () => {
    const { getAllByTestId } = render(
      <TodoContext.Provider value={contextMock}>
        <App />
      </TodoContext.Provider>
    );
    expect(getAllByTestId("App").length).toBeInTheDocument;
  });

  it("should add todo", async () => {
    const { getByTestId } = render(
      <TodoContext.Provider value={contextMock}>
        <App />
      </TodoContext.Provider>
    );
    fireEvent.change(getByTestId("form-input"), {
      target: { value: "Test todo" },
    });
    fireEvent.submit(getByTestId("form"));
    expect(contextMock.onAddTodo).toHaveBeenCalledTimes(1);
  });

  it("should log user out on error", async () => {
    const logout = jest.fn();
    const getTodos = jest.fn().mockRejectedValue({ response: { status: 401 } });
    contextMock.todolist = null;
    contextMock.getTodos = getTodos;
    render(
      <AuthContext.Provider value={{ logout }}>
        <TodoContext.Provider value={contextMock}>
          <App />
        </TodoContext.Provider>
      </AuthContext.Provider>
    );
    await waitFor(() => {
      expect(getTodos).toHaveBeenCalledTimes(1);
      expect(logout).toHaveBeenCalledTimes(1);
    });
  });

  it("should export data", async () => {
    process.env.REACT_APP_OFFLINE_MODE = "true";
    mockedService.exportData = jest.fn();
    const { getByText } = render(
      <TodoContext.Provider value={contextMock}>
        <App />
      </TodoContext.Provider>
    );
    const saveButton = getByText(/Save to file/);
    expect(saveButton).not.toHaveAttribute("disabled");
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(mockedService.exportData).toHaveBeenCalledTimes(1);
    });
  });

  it("should import data", async () => {
    process.env.REACT_APP_OFFLINE_MODE = "true";
    mockedService.importData = jest.fn();
    const file = new Blob([JSON.stringify(todolist)], {
      type: "application/json",
    });
    const { getByText, getByTestId } = render(
      <NotificationProvider>
        <TodoContext.Provider value={contextMock}>
          <App />
        </TodoContext.Provider>
      </NotificationProvider>
    );
    const input = getByTestId("uploadInput");

    await waitFor(() => {
      fireEvent.change(input, { target: { files: [file] } });
      fireEvent.input(input);
    });

    fireEvent.click(getByText(/Upload/));

    await waitFor(() => {
      expect(mockedService.importData).toHaveBeenCalledTimes(1);
    });
  });
});
