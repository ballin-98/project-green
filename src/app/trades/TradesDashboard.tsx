"use client";
import { useUser } from "@/app/context/UserContext";
import {
  getAccountsKey,
  getAccounts,
  deleteAccount,
} from "@/app/lib/accountService";
import { getTrades } from "@/app/lib/stockService";
import { TradeInfo } from "@/app/lib/types";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import AccountTab from "../stocks/AccountTab";

export default function TradesDashboard() {
  const { user } = useUser();

  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);
  const [trades, setTrades] = useState<TradeInfo[]>([]);
  const [loadingTrades, setLoadingTrades] = useState(false);

  /** Load accounts once user exists */
  const { data: accounts = [] } = useSWR(
    user ? getAccountsKey(user.id) : null,
    () => getAccounts(user!.id),
  );

  /** Pick active account (saved or first) */
  useEffect(() => {
    if (!accounts.length || activeAccountId) return;
    setActiveAccountId(accounts[0].id);
  }, [accounts, activeAccountId]);

  /** Load trades when account changes */
  useEffect(() => {
    if (!user || !activeAccountId) return;

    const fetchTrades = async () => {
      setLoadingTrades(true);
      try {
        const data = await getTrades(user.id, activeAccountId);
        setTrades(data);
      } catch (err) {
        console.error("Failed to load trades", err);
      } finally {
        setLoadingTrades(false);
      }
    };

    fetchTrades();
  }, [user, activeAccountId]);

  const columns: GridColDef[] = [
    { field: "stockName", headerName: "Ticker", flex: 1 },
    { field: "shares", headerName: "Qty", flex: 1 },
    { field: "profit", headerName: "Profit", flex: 1 },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      valueFormatter: (value) =>
        value
          ? new Date(value).toLocaleDateString("en-CA", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })
          : "",
    },
  ];

  if (!user) return null;

  const handleDeleteAccount = async (accountId: string, index: number) => {
    if (!user) return;
    let newActiveId: string = "";
    if (activeAccountId === accountId) {
      // Choose previous account in the list, or next if first deleted
      newActiveId = accounts[index - 1]?.id || accounts[index + 1]?.id || "";
    }
    await deleteAccount(accountId);
    mutate(getAccountsKey(user.id));
    setActiveAccountId(newActiveId);
  };

  return (
    <Box
      sx={{ height: "100%", display: "flex", flexDirection: "column", mt: 2 }}
    >
      {/* Account Tabs */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%",
        }}
      >
        {accounts.map((account, index) => (
          <AccountTab
            key={index}
            accountIndex={index}
            accountName={account.nickname ?? "Unnamed Account"}
            accountId={account.id}
            isActive={activeAccountId === account.id}
            //   this needs to be passed in and it's going to act like a filter
            onDelete={handleDeleteAccount}
            onSelect={() => setActiveAccountId(account.id)}
          />
        ))}
        <Box
          sx={{
            height: "30px",
            width: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        ></Box>
      </Box>

      {/* Trades Grid */}
      <Box sx={{ flex: 1 }}>
        <DataGrid
          rows={trades}
          columns={columns}
          loading={loadingTrades}
          sx={{ border: 0 }}
          getRowId={(row) => `${row.stockName}-${row.date}`}
        />
      </Box>
    </Box>
  );
}
