// app/StockProvider.tsx
"use client";

import { ReactNode, createContext, useContext } from "react";
import useSWR from "swr";
import { getStock } from "../lib/stockService";
import { ClientStockData } from "../lib/types";
import { useUser } from "./UserContext";
export const StockContext = createContext<{
  stocks?: ClientStockData[];
  mutate: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
} | null>(null);

export function useStockContext() {
  const ctx = useContext(StockContext);
  if (!ctx)
    throw new Error("useStockContext must be used inside StockProvider");
  return ctx;
}

export function StockProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();

  const {
    data: stocks,
    mutate,
    error,
  } = useSWR(user?.id ? `/stocks/${user.id}` : null, () => getStock(user!.id), {
    dedupingInterval: 60_000,
    revalidateOnFocus: false,
  });

  return (
    <StockContext.Provider value={{ stocks, mutate, error }}>
      {children}
    </StockContext.Provider>
  );
}
