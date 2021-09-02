import React from "react";
import localStorage from "../services/localStorage";
import { render, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { TodoContext, TodoProvider } from "./todoContext";
import { Todo } from "../models/todo";
import { NotificationProvider } from "./notificationContext";
import { todolist } from "../test-utils/mocks";

jest.mock("../services/localStorage");
const mockedService = localStorage as jest.Mocked<typeof localStorage>;

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

const mockTodolist: Todo[] = todolist;

describe("TodoContext", () => {
  it("should get todos", async () => {
    mockedService.GET_TODOS = jest.fn().mockResolvedValueOnce(mockTodolist);
    const { getByText } = render(
      <TodoProvider>
        <TodoContext.Consumer>
          {({ getTodos }) => <button onClick={getTodos}>Get todos</button>}
        </TodoContext.Consumer>
      </TodoProvider>
    );
    fireEvent.click(getByText("Get todos"));
    await waitFor(() => {
      expect(mockedService.GET_TODOS).toHaveBeenCalledTimes(1);
    });
  });

  it("should add todo", async () => {
    mockedService.ADD_TODO.mockResolvedValueOnce(mockTodolist[0]);
    const { getAllByRole } = render(
      <TodoProvider>
        <TodoContext.Consumer>
          {({ onAddTodo, todolist }) => (
            <>
              <ul>
                {todolist?.map((todo) => (
                  <li key={todo.id}>{todo.content}</li>
                ))}
              </ul>
              <button onClick={() => onAddTodo(mockTodolist[0])}>
                Add todo
              </button>
            </>
          )}
        </TodoContext.Consumer>
      </TodoProvider>
    );
    fireEvent.click(getAllByRole("button")[0]);
    await waitFor(() => {
      expect(mockedService.ADD_TODO).toHaveBeenCalledTimes(1);
      expect(getAllByRole("listitem")).toHaveLength(1);
    });
  });

  it("should be able to toggle todo status", async () => {
    mockedService.TOGGLE_TODO.mockResolvedValue({
      ...mockTodolist[0],
      completed: !mockTodolist[0].completed,
    });
    mockedService.GET_TODOS.mockResolvedValue(mockTodolist);
    const { getByText, getAllByRole } = render(
      <TodoProvider>
        <TodoContext.Consumer>
          {({ todolist, getTodos, toggleTodo }) => {
            return (
              <>
                {todolist ? (
                  <>
                    <ul>
                      {todolist
                        ?.filter((todo) => !todo.completed)
                        .map((todo) => (
                          <li key={todo.id}>{todo.content}</li>
                        ))}
                    </ul>
                    <button onClick={() => toggleTodo(todolist[0].id)}>
                      Toggle todo
                    </button>
                  </>
                ) : (
                  <button onClick={getTodos}>Get todos</button>
                )}
              </>
            );
          }}
        </TodoContext.Consumer>
      </TodoProvider>
    );

    fireEvent.click(getByText(/Get todos/));
    await waitFor(() => {
      expect(mockedService.GET_TODOS).toHaveBeenCalledTimes(1);
    });
    fireEvent.click(getByText(/Toggle/));
    await waitFor(() => {
      expect(mockedService.TOGGLE_TODO).toHaveBeenCalledTimes(1);
      expect(getAllByRole("listitem")).toHaveLength(mockTodolist.length - 1);
    });
  });

  it("should be able to delete todo", async () => {
    mockedService.GET_TODOS.mockResolvedValue(mockTodolist);
    mockedService.DELETE_TODOS.mockResolvedValue([]);
    const { getByText, getAllByText } = render(
      <NotificationProvider>
        <TodoProvider value={{ todolist: mockTodolist }}>
          <TodoContext.Consumer>
            {({ deleteTodo, getTodos, todolist }) => {
              return (
                <>
                  <ul>
                    {todolist?.map((todo) => (
                      <li key={todo.id}>
                        <p>{todo.content}</p>
                        <button onClick={() => deleteTodo(todo.id)}>
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => getTodos()}>Get todos</button>
                </>
              );
            }}
          </TodoContext.Consumer>
        </TodoProvider>
      </NotificationProvider>
    );
    fireEvent.click(getByText(/Get todos/));
    await waitFor(() => {
      expect(mockedService.GET_TODOS).toHaveBeenCalledTimes(1);
      expect(getAllByText(/Delete/)).toHaveLength(mockTodolist.length);
    });
    fireEvent.click(getAllByText("Delete")[0]);
    await waitFor(() => {
      expect(mockedService.DELETE_TODOS).toHaveBeenCalledTimes(1);
      expect(getAllByText("Delete")).toHaveLength(mockTodolist.length - 1);
    });
  });

  it("should be able to edit todo", async () => {
    mockedService.GET_TODOS.mockResolvedValue(mockTodolist);
    mockedService.EDIT_TODO.mockResolvedValue({
      ...mockTodolist[0],
      content: "Edited",
    });
    const { getByText } = render(
      <NotificationProvider>
        <TodoProvider>
          <TodoContext.Consumer>
            {({ todolist, editTodo, getTodos }) => (
              <>
                {todolist && <p>{todolist[0].content}</p>}
                <button onClick={getTodos}>Get todos</button>
                <button
                  onClick={() => editTodo(todolist && todolist[0].id, "test")}
                >
                  Edit todo
                </button>
              </>
            )}
          </TodoContext.Consumer>
        </TodoProvider>
      </NotificationProvider>
    );
    fireEvent.click(getByText(/Get todos/));
    await waitFor(() => {
      expect(getByText(mockTodolist[0].content)).toBeInTheDocument();
    });
    fireEvent.click(getByText(/Edit/));
    await waitFor(() => {
      expect(getByText(/Edited/)).toBeInTheDocument();
    });
  });
});
