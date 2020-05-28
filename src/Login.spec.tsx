import React from "react";
import { render } from "@testing-library/react";
import Login from "./Login";

describe("Login page", () => {
  it("should render form with login, sign up and offline choices", () => {
    const { getByText, getByTestId } = render(<Login />);
    expect(getByTestId("Login")).toBeInTheDocument();
    expect(getByText(/log in/i)).toBeInTheDocument();
  });
});
