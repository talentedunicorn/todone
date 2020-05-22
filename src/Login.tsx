import React, { useState } from "react";

enum Mode {
  LOGIN = "login",
  SIGNUP = "signup"
}

const Login = () => {
  const [mode, setMode] = useState(Mode.LOGIN);

  return (
    <div data-testid="Login">
      <h2>ToDone</h2>

      <form role="form">
        <label>
          <span className="visually-hidden">Username</span>
          <input type="text" placeholder="Username" />
        </label>

        <label>
          <span className="visually-hidden">Password</span>
          <input type="password" placeholder="Password" />
        </label>

        {mode === Mode.SIGNUP && (
          <label>
            <span className="visually-hidden">Email address</span>
            <input type="email" placeholder="Email address" />
          </label>
        )}

        <div className="Controls">
          <button className="Button">Log in</button>
          <button className="Button">Sign up</button>
          <button className="Button">Use offline</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
