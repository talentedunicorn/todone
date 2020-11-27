import React from "react";
import ReactDOM from "react-dom";
import ReactGA from "react-ga";
import "./index.css";
import App from "./App";
import Login from "./Login";
import * as serviceWorker from "./serviceWorker";
import { TodoProvider } from "./context/todoContext";
import { AuthProvider, AuthContext } from "./context/authContext";
import { NotificationProvider } from "./context/notificationContext";

if (process.env.REACT_APP_GOOGLE_TRACKING_ID) {
  ReactGA.initialize(process.env.REACT_APP_GOOGLE_TRACKING_ID);
  ReactGA.pageview(window.location.pathname);
}

const IS_OFFLINE = process.env.REACT_APP_OFFLINE_MODE;

ReactDOM.render(
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
  </NotificationProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
serviceWorker.register();
