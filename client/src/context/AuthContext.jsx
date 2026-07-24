import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";

const AuthContext = React.createContext();

export const AuthProvider = (props) => {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("User")) || "");
  const [isLogin, setIsLogin] = useState(!!user);
  const [role , setRole] = useState(user?.role || "")


  useEffect(() => {
    setIsLogin(!!user);
    setRole(user?.role || "")
  }, [user]);

  const value = { user, setUser, isLogin, setIsLogin , role , setRole };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};


