import React from "react";
import { createRoot } from "react-dom/client";
import ReactGA from "react-ga";
import "./index.css";
import App from "./App";
import Login from "./Login";
import { TodoProvider } from "./context/todoContext";
import { AuthProvider, AuthContext } from "./context/authContext";
import { NotificationProvider } from "./context/notificationContext";

if (process.env.REACT_APP_GOOGLE_TRACKING_ID) {
  ReactGA.initialize(process.env.REACT_APP_GOOGLE_TRACKING_ID);
  ReactGA.pageview(window.location.pathname);
}

const IS_OFFLINE = process.env.REACT_APP_OFFLINE_MODE;

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <NotificationProvider>
    <AuthProvider>
      <AuthContext.Consumer>
        {({ token }) =>
          token || IS_OFFLINE === "true" ? (
            <TodoProvider>
              <App />
            </TodoProvider>
          ) : (
            <Login />
          )
        }
      </AuthContext.Consumer>
    </AuthProvider>
  </NotificationProvider>
);
