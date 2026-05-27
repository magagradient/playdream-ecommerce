import { createContext, useState, useEffect, useCallback } from "react";
import { loginRequest, getProfileRequest, refreshTokenRequest, logoutRequest } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [checkingAuth, setCheckingAuth] = useState(true);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        await logoutRequest(refreshToken);
      } catch (error) {
        console.error("Error en logout:", error);
      }
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setToken(null);
    setUser(null);
  }, []);

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      await logout();
      return null;
    }
    try {
      const data = await refreshTokenRequest(refreshToken);
      localStorage.setItem("accessToken", data.accessToken);
      setToken(data.accessToken);
      return data.accessToken;
    } catch (error) {
      await logout();
      return null;
    }
  }, [logout]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setCheckingAuth(false);
        return;
      }
      try {
        const response = await getProfileRequest(token);
        const userData = response?.data || response;
        setUser(userData);
      } catch (error) {
        // si el accessToken expiró intentamos refrescarlo
        const newToken = await refreshAccessToken();
        if (newToken) {
          try {
            const response = await getProfileRequest(newToken);
            const userData = response?.data || response;
            setUser(userData);
          } catch {
            await logout();
          }
        }
      } finally {
        setCheckingAuth(false);
      }
    };

    fetchProfile();
  }, [token, refreshAccessToken, logout]);

  const login = async (email, password) => {
    const response = await loginRequest(email, password);

    const accessToken = response?.accessToken;
    const refreshToken = response?.refreshToken;
    const userData = response?.user;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setToken(accessToken);
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, token, checkingAuth, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};