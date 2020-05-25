import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { LOGIN, SET_TOKEN } from "../services/boba";

type contextProps = {
  token: string | null;
  login: any;
  logout: any;
};

const AuthContext = React.createContext<Partial<contextProps>>({});

const AuthProvider = (props: any) => {
  const [token, setToken] = useState<string | null>(null);
  let history = useHistory();

  const login = async (creds: any) => {
    if (creds === "offline") {
      setToken("offline");
      return history.push("/app");
    }

    // Login then set token
    await LOGIN(creds).then(data => {
      setToken(data);
      return history.push("/app");
    });

    return false;
  };

  const logout = () => {
    setToken(null);
    window.localStorage.removeItem("todone");
    return history.push("/");
  };

  useEffect(() => {
    const token = JSON.parse(window.localStorage.getItem("todone") || "null");

    if (token) {
      setToken(token);
      SET_TOKEN(token);
      return history.push("/app");
    }
  }, [history]);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
