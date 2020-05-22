import React from "react";
import { render } from "@testing-library/react";
import Login from "./Login";

describe("Login page", () => {
  it("should render the login page", () => {
    const { getByTestId } = render(<Login />);
    expect(getByTestId("Login")).toBeInTheDocument();
  });

  it("should have login, sign up and offline choices", () => {
    const { getByText, getByRole } = render(<Login />);
    expect(getByRole("form")).toBeInTheDocument();
    expect(getByText(/log in/i)).toBeInTheDocument();
    expect(getByText(/sign up/i)).toBeInTheDocument();
    expect(getByText(/use offline/i)).toBeInTheDocument();
  });
});
