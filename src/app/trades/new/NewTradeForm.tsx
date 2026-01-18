"use client";

import { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, MenuItem } from "@mui/material";
import { addTrade } from "@/app/lib/stockService";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "@mui/icons-material";
import { useUser } from "@/app/context/UserContext";
import { AccountInfo } from "@/app/lib/types";
import { getAccounts } from "@/app/lib/accountService";

export default function TradeForm() {
  const [stockName, setStockName] = useState("");
  const [shares, setShares] = useState<string>("");
  const [profit, setProfit] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [accountsData, setAccountsData] = useState<AccountInfo[]>([]);
  const [accountId, setAccountId] = useState<string>("");
  const { user } = useUser();

  const searchParams = useSearchParams();

  useEffect(() => {
    // Load query parameters once component mounts
    const initialAccountId = searchParams.get("accountId");
    setAccountId(initialAccountId || "");
  }, [searchParams]);

  useEffect(() => setMounted(true), []);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    const fetchAccounts = async () => {
      try {
        const accounts = await getAccounts(user.id);
        setAccountsData(accounts);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };
    fetchAccounts();
  }, [user]);

  if (!mounted) return null; // render nothing until mounted

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user && !accountId) return;
    await addTrade(
      user?.id ?? "",
      stockName,
      Number(shares),
      Number(profit),
      accountId,
    );

    router.push("/");
  };

  const handleAccountId = (value: string) => {
    setAccountId(value);
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: 400,
          padding: 2,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "white",
          marginTop: 4,
        }}
      >
        <Typography variant="h6">New Trade Information</Typography>
        <TextField
          select
          label="Account"
          value={accountId}
          onChange={(e) => handleAccountId(e.target.value)}
          required
        >
          {accountsData.map((account: AccountInfo) => (
            <MenuItem key={account.id} value={account.id}>
              {account.nickname}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Stock Name"
          value={stockName}
          onChange={(e) => setStockName(e.target.value)}
          required
        />

        <TextField
          label="Shares"
          type="number"
          value={shares}
          onChange={(e) => setShares(e.target.value)}
          required
        />

        <TextField
          label="Profit"
          type="number"
          value={profit}
          onChange={(e) => setProfit(e.target.value)}
          required
        />

        <Button variant="contained" type="submit">
          Add Trade
        </Button>
      </Box>
      <Button
        variant="contained"
        sx={{ padding: 1, mt: 2 }}
        startIcon={<ArrowLeft />}
        onClick={() => router.push("/")}
      >
        Back
      </Button>
    </>
  );
}
