import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore login session
  useEffect(() => {
    const loadUser = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await API.get("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user);
      } catch (error) {
        sessionStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Register
  const register = async (userData) => {
    const response = await API.post(
      "/api/auth/register",
      userData
    );

    sessionStorage.setItem("token", response.data.token);
    setUser(response.data.user);

    return response.data;
  };

  // Login
  const login = async (credentials) => {
    const response = await API.post(
      "/api/auth/login",
      credentials
    );

    sessionStorage.setItem("token", response.data.token);
    setUser(response.data.user);

    return response.data;
  };

  // Logout
  const logout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);