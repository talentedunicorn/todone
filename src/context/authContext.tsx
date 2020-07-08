import React, { useState, useEffect } from "react";
import { LOGIN } from "../services/boba";

type contextProps = {
  token: string | null;
  login: any;
  logout: any;
};

const AuthContext = React.createContext<Partial<contextProps>>({});

const AuthProvider = (props: any) => {
  const STORAGE_TYPE = process.env.REACT_APP_STORAGE_TYPE;
  const [token, setToken] = useState<string | null>(null);

  const login = async (creds: any) => {
    // Login then set token
    await LOGIN(creds).then((data: any) => {
      setToken(data);
      window.localStorage.setItem("token", data);
    });

    return false;
  };

  const logout = () => {
    setToken(null);
    window.localStorage.removeItem("token");
  };

  useEffect(() => {
    // Offline, skip login
    if (STORAGE_TYPE === "offline") {
      setToken("offline");
    } else {
      const cachedToken = window.localStorage.getItem("token");
      if (cachedToken) {
        setToken(cachedToken);
      }
    }
  }, [STORAGE_TYPE, token]);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
