// app/providers.tsx
"use client";

import { ReactNode } from "react";
import { StockProvider } from "./StockProvider";
import AppHeader from "../stocks/AppHeader";
import { UserProvider } from "./UserContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <StockProvider>
        <AppHeader />
        {children}
      </StockProvider>
    </UserProvider>
  );
}
