import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { LOGIN, LOGOUT } from "../services/index";

type contextProps = {
  token: string | null;
  login: any;
  logout: any;
};

const AuthContext = React.createContext<Partial<contextProps>>({});

const AuthProvider = (props: any) => {
  const STORAGE_TYPE = process.env.REACT_APP_STORAGE_TYPE;
  const [token, setToken] = useState<string | null>(null);
  const history = useHistory();
  const location = useLocation();

  const login = async (creds: any) => {
    // Login then set token
    await LOGIN(creds).then((data: any) => {
      setToken(data);
      return history.push("/app");
    });

    return false;
  };

  const logout = () => {
    setToken(null);
    LOGOUT();
    return history.replace("/");
  };

  useEffect(() => {
    const cachedToken = window.localStorage.getItem("token");
    if (cachedToken) {
      setToken(cachedToken);
      return history.push("/app");
    }

    console.log("running auth", location.pathname);
    // Offline, skip login
    if (STORAGE_TYPE === "offline") {
      if (location.pathname === "/") {
        return history.replace("/app");
      }
    } else {
      if (location.pathname === "/app" && !Boolean(token)) {
        return history.replace("/");
      }
    }
  }, [STORAGE_TYPE, location.pathname, history, token]);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
