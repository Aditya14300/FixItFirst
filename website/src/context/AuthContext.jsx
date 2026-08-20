"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "@/app/services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await getProfile();
        setUser(res.user);
      } catch {
        setUser(null);
      }
    }

    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      loadUser();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);