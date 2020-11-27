import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  cleanup,
  getByRole,
} from "@testing-library/react";
import {
  NotificationProvider,
  NotificationContext,
} from "./notificationContext";

afterEach(() => {
  cleanup();
});

describe("NotificationContext", () => {
  it("should not be visible on empty notifications", () => {
    const { queryByTestId } = render(
      <NotificationProvider>
        <NotificationContext.Consumer>
          {() => (
            <div>
              <h2>Test page</h2>
            </div>
          )}
        </NotificationContext.Consumer>
      </NotificationProvider>
    );

    expect(queryByTestId("Notification")).not.toBeInTheDocument();
  });

  it("should show notifications", async () => {
    const { getByText, queryByTestId, getAllByRole } = render(
      <NotificationProvider>
        <NotificationContext.Consumer>
          {({ notify }) => (
            <div>
              <button onClick={() => notify("Test notification")}>
                Set notification
              </button>
            </div>
          )}
        </NotificationContext.Consumer>
      </NotificationProvider>
    );

    expect(queryByTestId("Notification")).not.toBeInTheDocument();
    fireEvent.click(getByText(/Set notification/));
    fireEvent.click(getByText(/Set notification/));
    await waitFor(() => {
      expect(queryByTestId("Notification")).toBeInTheDocument();
      expect(getAllByRole("listitem")).toHaveLength(2);
    });
  });

  it("should clear notifications", async () => {
    const { getByText, queryByTestId } = render(
      <NotificationProvider>
        <NotificationContext.Consumer>
          {({ notify, clearNotifications }) => (
            <div>
              <button onClick={() => notify("Test")}>Notify</button>
            </div>
          )}
        </NotificationContext.Consumer>
      </NotificationProvider>
    );

    fireEvent.click(getByText(/Notify/));
    await waitFor(() => {
      expect(queryByTestId("Notification")).toBeInTheDocument();
    });

    fireEvent.click(getByText(/Clear/));
    await waitFor(() => {
      expect(queryByTestId("Notification")).not.toBeInTheDocument();
    });
  });

  it("should set notification status", async () => {
    const { getByRole } = render(
      <NotificationProvider>
        <NotificationContext.Consumer>
          {({ notify }) => (
            <div>
              <button onClick={() => notify("Error notification", "error")}>
                Notify
              </button>
            </div>
          )}
        </NotificationContext.Consumer>
      </NotificationProvider>
    );
    fireEvent.click(getByRole("button"));

    await waitFor(() => {
      expect(getByRole("listitem").getAttribute("data-status")).toBe("error");
    });
  });
});
