import React from "react";
import { render, fireEvent, waitFor, cleanup } from "@testing-library/react";
import App from "./App";
import { TodoContext } from "./context/todoContext";
import { todolist } from "./test-utils/mocks";
import { AuthContext } from "./context/authContext";
import { NotificationProvider } from "./context/notificationContext";
import MockedService from "./services/localStorage";

jest.mock("./services/localStorage");
const mockedService = MockedService as jest.Mocked<
  typeof MockedService & {
    importData: () => Promise<void>;
    exportData: () => Promise<void>;
  }
>;
let contextMock: any;

beforeAll(() => {
  process.env.REACT_APP_OFFLINE_MODE = "true";
});

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
    waitFor(() => {
      expect(contextMock.onAddTodo).toHaveBeenCalledTimes(1);
    });
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

  xit("should export data", async () => {
    mockedService.exportData = jest.fn().mockResolvedValue(true);
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

  xit("should import data", async () => {
    mockedService.importData = jest.fn().mockResolvedValue(true);
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
