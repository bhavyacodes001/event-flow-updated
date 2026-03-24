import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "./types";
import { mockUsers } from "./mock-data";

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
    const found = mockUsers.find((u) => u.email === email);
    if (found) {
      setUser(found);
      return true;
    }
    // For demo: any email with "admin" logs in as admin
    if (email.includes("admin")) {
      const newUser: User = { id: Date.now().toString(), name: "Admin", email, role: "admin" };
      setUser(newUser);
      return true;
    }
    // Any other email logs in as student
    const newUser: User = { id: Date.now().toString(), name: email.split("@")[0], email, role: "student" };
    setUser(newUser);
    return true;
  };

  const register = (name: string, email: string, _password: string) => {
    const newUser: User = { id: Date.now().toString(), name, email, role: "student" };
    setUser(newUser);
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
