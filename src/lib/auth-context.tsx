import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "./types";

const ADMIN_EMAIL = "creativevalue26@gmail.com";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string) => {
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      setUser({ id: "admin-1", name: "Admin", email, role: "admin" });
      return true;
    }
    // Any other email logs in as student
    setUser({ id: Date.now().toString(), name: email.split("@")[0], email, role: "student" });
    return true;
  };

  const register = (name: string, email: string, _password: string) => {
    setUser({ id: Date.now().toString(), name, email, role: "student" });
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
