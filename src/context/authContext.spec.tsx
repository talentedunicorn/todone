import React from "react";
import { AuthContext, AuthProvider } from "./authContext";
import { render, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { LOGIN } from "../services/boba";

jest.mock("../services/boba");

describe("AuthContext", () => {
  afterEach(() => {
    cleanup;
  });

  it("should be able to restore cached token", () => {
    global.localStorage.setItem("token", "token");
    const { getByText } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {({ token }) => (token ? <p>token exists</p> : <p>no token found</p>)}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    expect(getByText("token exists")).toBeInTheDocument();
  });

  it("should be able to login", async () => {
    (LOGIN as jest.Mock).mockResolvedValue("token");
    const { getByText } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {({ login }) => <button onClick={login}>Login</button>}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    expect(getByText("Login")).toBeInTheDocument();
    fireEvent.click(getByText("Login"));
    await waitFor(() => {
      expect(LOGIN).toHaveBeenCalledTimes(1);
    });
  });

  it("should be able to logout", async () => {
    global.localStorage.setItem("token", "test-token");
    const { getByText } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {({ logout }) => <button onClick={logout}>Logout</button>}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    fireEvent.click(getByText("Logout"));
    await waitFor(() => {
      expect(global.localStorage.getItem("token")).toBeFalsy();
    });
  });
});
