import React from "react";
import { render } from "@testing-library/react";
import Layout from "./layout";

describe("<Layout/>", () => {
  it("should render correctly", () => {
    const { getByTestId } = render(<Layout />);
    expect(getByTestId("layout")).toBeTruthy();
  });
});
