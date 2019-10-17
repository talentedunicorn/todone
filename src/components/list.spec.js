import React from "react";
import { render, fireEvent } from "@testing-library/react";
import List from "./list";

describe("<List/>", () => {
  it("should render without crashing", () => {
    const { getByTestId } = render(<List />);
    expect(getByTestId("List")).toBeTruthy();
  });

  it("should render items passed", () => {
    const items = [
      { id: 1, text: "One" },
      { id: 2, text: "Two" },
      { id: 3, text: "Three" }
    ];
    const { getByTestId } = render(<List items={items} />);
    expect(getByTestId("List").children.length).toBe(items.length);
  });

  it("should trigger handleClick when element is clicked", () => {
    const mockedHandleClick = jest.fn();
    const { getByText } = render(
      <List
        items={[{ id: 1, text: "click me" }]}
        handleItemClick={mockedHandleClick}
      />
    );
    fireEvent.click(getByText("click me"));

    expect(mockedHandleClick).toHaveBeenCalledWith(1);
  });

  it("should trigger handleDelete when button is clicked", () => {
    const mockedHandleDelete = jest.fn();
    const { getByText } = render(
      <List
        items={[{ id: 1, text: "delete me" }]}
        handleDelete={mockedHandleDelete}
      />
    );
    fireEvent.click(getByText("Delete"));
    expect(mockedHandleDelete).toHaveBeenCalledWith(1);
  });

  it("should trigger handleEdit when element is clicked", () => {
    const mockedHandleEdit = jest.fn();
    const { getByText } = render(
      <List
        items={[{ id: 1, text: "edit me" }]}
        handleItemClick={mockedHandleEdit}
      />
    );
    fireEvent.click(getByText("edit me"));

    expect(mockedHandleEdit).toHaveBeenCalledWith(1);
  });
});
