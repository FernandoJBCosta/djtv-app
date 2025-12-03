import { useState, useEffect } from "react";

const ADMIN_PASSWORD = "djtv2024"; // Change this to your desired password
const AUTH_KEY = "backoffice_authenticated";

export function useBackofficeAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStatus = sessionStorage.getItem(AUTH_KEY);
    setIsAuthenticated(authStatus === "true");
    setIsLoading(false);
  }, []);

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoading, login, logout };
}
