import localforage from "localforage";
import FileSaver from "file-saver";
import localStorage, { exportData } from "./localStorage";

const mockLocalforage = localforage as jest.Mocked<typeof localforage>;
const mockFileSaver = FileSaver as jest.Mocked<typeof FileSaver>;

describe("LocalStorage service", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("GET_TODOS", async () => {
    const testData = ["first", "second"];
    mockLocalforage.keys.mockResolvedValue(["0", "1"]);
    await Promise.all(testData.map((item) => localStorage.ADD_TODO(item)));
    const getTodos = await localStorage.GET_TODOS();
    expect(getTodos).toHaveLength(testData.length);
  });

  it("ADD_TODO", async () => {
    const testData = "Test todo";
    await localStorage.ADD_TODO(testData);
    expect(mockLocalforage.setItem.mock.calls[0][1]).toEqual(
      expect.objectContaining({ content: testData, completed: false })
    );
  });

  it("EDIT_TODO", async () => {
    const testData = { id: 1, content: "Old content", updated_at: null };
    mockLocalforage.getItem.mockResolvedValue(testData);
    await localStorage.EDIT_TODO(testData.id, "Edited");
    expect(mockLocalforage.setItem.mock.calls[0][1]).toEqual(
      expect.objectContaining({ content: "Edited" })
    );
  });

  it("TOGGLE_TODO", async () => {
    const testData = {
      id: 1,
      content: "Old content",
      updated_at: null,
      completed: false,
    };
    mockLocalforage.getItem.mockResolvedValue(testData);
    await localStorage.TOGGLE_TODO(testData.id, true);
    expect(mockLocalforage.setItem.mock.calls[0][1]).toEqual(
      expect.objectContaining({ completed: true })
    );
  });

  it("DELETE_TODOS", async () => {
    const todoIds = [1, 2, 4];
    mockLocalforage.removeItem.mockResolvedValue();
    await localStorage.DELETE_TODOS(todoIds);
    expect(mockLocalforage.removeItem).toHaveBeenCalledTimes(todoIds.length);
  });

  it("exports data", async () => {
    const testData = ["one", "two"];
    mockLocalforage.keys.mockResolvedValue(Object.keys(testData));
    mockLocalforage.getItem.mockResolvedValue("mocked-value");
    await exportData();
    expect(mockLocalforage.getItem).toHaveBeenCalledTimes(testData.length);
    expect(mockFileSaver.saveAs).toHaveBeenCalledTimes(1);
  });
});
