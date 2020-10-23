import React from "react";
import { render, fireEvent, wait } from "@testing-library/react";
import Login from "./Login";
import { AuthContext } from "./context/authContext";

describe("Login page", () => {
  it("should render form", () => {
    const { getByText, getByTestId } = render(<Login />);
    expect(getByTestId("Login")).toBeInTheDocument();
    expect(getByText(/log in/i)).toBeInTheDocument();
  });

  it("should handle form submission", async () => {
    const login = jest.fn().mockResolvedValueOnce(true);
    const { getByTestId, getByRole } = render(
      <AuthContext.Provider value={{ login }}>
        <Login />
      </AuthContext.Provider>
    );
    const button = getByRole("button");
    const usernameInput = getByTestId("usernameInput");
    const passwordInput = getByTestId("passwordInput");

    // Check form button state
    expect(button.disabled).toBe(true);

    // Add data to form inputs
    fireEvent.change(usernameInput, { target: { value: "test" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });

    // Check form button state
    expect(button.disabled).toBe(false);
    await wait(() => fireEvent.click(button));

    expect(login).toHaveBeenCalledTimes(1);
  });
});
