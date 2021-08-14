/* eslint-disable new-cap */
import axios from "axios";
import boba, { LOGIN } from "./boba";

jest.mock("axios");
const mockAxios = axios as jest.Mocked<typeof axios>;

describe("Boba service", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("LOGIN", async () => {
    const data = { username: "test", password: "testpassword" };
    mockAxios.post.mockResolvedValue({ data: "success" });
    await LOGIN(data);
    expect(mockAxios.post).toHaveBeenCalledTimes(1);
    expect(mockAxios.post).toHaveBeenLastCalledWith("/auth/local", {
      identifier: data.username,
      password: data.password,
    });
  });

  it("GET_TODOS", async () => {
    const data = [1, 3, 4];
    mockAxios.get.mockResolvedValue({ data });
    const getTodos = await boba.GET_TODOS("fake-token");
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith("/todos", {
      headers: { Authorization: "Bearer fake-token" },
    });
    expect(getTodos).toEqual(data);
  });

  it("ADD_TODO", async () => {
    const newTodo = "Do test";
    mockAxios.post.mockResolvedValue({ data: newTodo });

    const addTodo = await boba.ADD_TODO(newTodo, "fake-token");
    expect(mockAxios.post).toHaveBeenCalledTimes(1);
    expect(mockAxios.post.mock.calls[0]).toEqual(
      expect.arrayContaining(["/todos", { completed: false, content: newTodo }])
    );
    expect(addTodo).toBe(newTodo);
  });

  it("TOGGLE_TODO", async () => {
    const todoId = 2;
    mockAxios.put.mockResolvedValue({ data: todoId });
    const toggleTodo = await boba.TOGGLE_TODO(todoId, false, "fake-token");

    expect(mockAxios.put).toHaveBeenCalledTimes(1);
    expect(mockAxios.put.mock.calls[0]).toEqual(
      expect.arrayContaining([`/todos/${todoId}`, { completed: false }])
    );
    expect(toggleTodo).toBe(todoId);
  });

  it("EDIT_TODO", async () => {
    const data = { id: 1, content: "Updated stuff" };
    mockAxios.put.mockResolvedValue({ data });
    const editTodo = await boba.EDIT_TODO(data.id, data.content, "fake-token");

    expect(mockAxios.put).toHaveBeenCalledTimes(1);
    expect(mockAxios.put.mock.calls[0]).toEqual(
      expect.arrayContaining([`/todos/${data.id}`, { content: data.content }])
    );
    expect(editTodo).toBe(data);
  });

  it("DELETE_TODO", async () => {
    const todoIds = [1, 2];
    mockAxios.delete.mockResolvedValue({ data: todoIds });
    await boba.DELETE_TODOS(todoIds, "fake-token");
    expect(mockAxios.delete).toHaveBeenCalledTimes(2);
    expect(mockAxios.delete.mock.calls[0]).toEqual(
      expect.arrayContaining([`/todos/${todoIds[0]}`])
    );
    expect(mockAxios.delete.mock.calls[1]).toEqual(
      expect.arrayContaining([`/todos/${todoIds[1]}`])
    );
  });
});
