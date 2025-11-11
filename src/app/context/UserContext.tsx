/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { AppUser } from "../stocks/dashboard";
import { createClientSideClient } from "../lib/supabaseClientSide";

type UserContextType = {
  user: AppUser | undefined;
  setUser: Dispatch<SetStateAction<AppUser | undefined>>;
  loading: boolean;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let listener: any;

    const init = async () => {
      const supabase = await createClientSideClient();
      if (!supabase) return;

      // 1️⃣ Get current user
      const { data: authData } = await supabase.auth.getUser();
      const currentUser = authData?.user;
      if (currentUser) {
        setUser({ id: currentUser.id, email: currentUser.email || "" });
      }
      setLoading(false);

      // 2️⃣ Listen for sign in/out events
      const { data: sub } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          const newUser = session?.user;
          setUser(
            newUser ? { id: newUser.id, email: newUser.email || "" } : undefined
          );
        }
      );

      listener = sub;
    };

    init();

    return () => {
      // Cleanup listener if it exists
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside a UserProvider");
  return context;
}
