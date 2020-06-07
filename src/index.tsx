import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import ReactGA from "react-ga";
import "./index.css";
import App from "./App";
import Login from "./Login";
import * as serviceWorker from "./serviceWorker";
import { TodoProvider } from "./context/todoContext";
import { AuthProvider } from "./context/authContext";

if (process.env.REACT_APP_GOOGLE_TRACKING_ID) {
  ReactGA.initialize(process.env.REACT_APP_GOOGLE_TRACKING_ID);

  const history = createHistory();
  history.listen(location => {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  });
}

ReactDOM.render(
  <Router>
    <AuthProvider>
      <TodoProvider>
        <Switch>
          <Route path="/app">
            <App />
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </TodoProvider>
    </AuthProvider>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
serviceWorker.register();
