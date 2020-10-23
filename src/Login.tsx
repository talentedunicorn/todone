import React, { useContext, useState } from "react";
import Styles from "./Login.module.css";
import { AuthContext } from "./context/authContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [submitting, setSubmitting] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const isValidForm = () => username && password;

  const handleSubmit = (e: any) => {
    setSubmitting(true);
    e.preventDefault();
    login({ username, password }).finally(() => {
      setSubmitting(false);
    });
  };

  return (
    <div data-testid="Login" className={Styles.Wrapper}>
      <h2 className={Styles.Title}>
        <span className="visually-hidden">ToDone</span>
      </h2>

      <form className={Styles.Form} onSubmit={handleSubmit}>
        <label>
          <span className="visually-hidden">Username</span>
          <input
            type="text"
            data-testid="usernameInput"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className={Styles.Input}
            placeholder="Username"
          />
        </label>

        <label>
          <span className="visually-hidden">Password</span>
          <input
            type="password"
            data-testid="passwordInput"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={Styles.Input}
            placeholder="Password"
          />
        </label>

        <div className={Styles.Controls}>
          <button
            className={Styles.Login}
            type="submit"
            disabled={submitting || !isValidForm()}
          >
            Log in
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
