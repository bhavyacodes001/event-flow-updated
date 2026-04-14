import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "./types";
import { supabase } from "./supabase";
import { toast } from "sonner";

const ADMIN_EMAIL = "creativevalue26@gmail.com"; // Keep hardcoded admin check for simple RBAC

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const uEmail = session.user.email || "";
        const uRole = uEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? "admin" : "student";
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || uEmail.split("@")[0],
          email: uEmail,
          role: uRole,
        });
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          const uEmail = session.user.email || "";
          const uRole = uEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? "admin" : "student";
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || uEmail.split("@")[0],
            email: uEmail,
            role: uRole,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      return false;
    }
    return true;
  };

  const register = async (name: string, email: string, password: string) => {
    // Supabase will automatically send a verification email if that setting is enabled in the dashboard
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });
    
    if (error) {
      toast.error(error.message);
      return false;
    }
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
