import React from "react";
import { render } from "@testing-library/react";
import List from "./list";

describe("<List/>", () => {
  it("should render without crashing", () => {
    const { getByTestId } = render(<List items={[]} />);
    expect(getByTestId("EmptyMessage")).toBeTruthy();
  });
});
