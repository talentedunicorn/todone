import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { LOGIN } from "../services/boba";

type contextProps = {
  token: string | null;
  login: any;
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

  return (
    <AuthContext.Provider value={{ token, login }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
