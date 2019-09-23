import React from "react";
import { render } from "@testing-library/react";
import Form from "./form";

describe("<Form />", () => {
  it("should load without crashing", () => {
    const { getByTestId } = render(<Form />);
    expect(getByTestId("form")).toBeTruthy();
  });
});
