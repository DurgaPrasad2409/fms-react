import { createContext, useContext, useState } from "react";
import * as store from "../lib/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // restore the session on refresh so a page reload doesn't log you out
  const [user, setUser] = useState(() => store.getCurrentUser());

  const login = (username, password) => {
    const match = store.loginUser(username, password);
    if (match) setUser(store.getCurrentUser());
    return match;
  };

  const signup = ({ name, username, password }) => {
    const created = store.registerUser({ name, username, password });
    if (!created) return null;
    store.loginUser(username, password); // sign straight in after signup
    setUser(store.getCurrentUser());
    return created;
  };

  const logout = () => {
    store.logout();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
