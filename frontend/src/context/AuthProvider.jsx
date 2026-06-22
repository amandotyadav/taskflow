import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import AuthContext from "./AuthContext";

const TOKEN_KEY = "taskflow_token";
const USER_KEY = "taskflow_user";

const readStoredUser = () => {
  try {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(readStoredUser);
  const [bootstrapping, setBootstrapping] = useState(true);

  const persistSession = (nextToken, nextUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        setBootstrapping(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        setUser(data.user);
      } catch {
        clearSession();
      } finally {
        setBootstrapping(false);
      }
    };

    loadProfile();
  }, [token]);

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    persistSession(data.token, data.user);
    return data.user;
  };

  const signup = async (payload) => {
    const { data } = await api.post("/auth/signup", payload);
    persistSession(data.token, data.user);
    return data.user;
  };

  const updateProfile = async (payload) => {
    const { data } = await api.put("/auth/profile", payload);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      bootstrapping,
      login,
      signup,
      logout: clearSession,
      updateProfile
    }),
    [token, user, bootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
