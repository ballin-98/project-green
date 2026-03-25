"use client";

import { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, MenuItem } from "@mui/material";
import { addTrade } from "@/app/lib/stockService";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Refresh } from "@mui/icons-material";
import { useUser } from "@/app/context/UserContext";
import { AccountInfo } from "@/app/lib/types";
import { getAccounts } from "@/app/lib/accountService";

export default function NewTradeForm() {
  const searchParams = useSearchParams();
  const [stockName, setStockName] = useState("");
  const [shares, setShares] = useState<string>("");
  const [profit, setProfit] = useState<string>("");
  const [buyingPrice, setBuyingPrice] = useState<string>("");
  const [sellingPrice, setSellingPrice] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [accountsData, setAccountsData] = useState<AccountInfo[]>([]);
  const [accountId, setAccountId] = useState<string>("");
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    // Load query parameters once component mounts
    if (!searchParams) return;
    const initialAccountId = searchParams.get("accountId");
    setAccountId(initialAccountId || "");
  }, [searchParams]);

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

  useEffect(() => {
    const calculatedProfit =
      (Number(sellingPrice) - Number(buyingPrice)) * Number(shares);
    setProfit(`${calculatedProfit.toFixed(2)}`);
  }, [buyingPrice, sellingPrice, shares]);

  const isProfit = Number(profit) >= 0;

  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !accountId) return;
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

  const clearForm = () => {
    setStockName("");
    setShares("");
    setBuyingPrice("");
    setSellingPrice("");
    setProfit("");
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
        <Box>
          <Typography variant="h6">New Trade Information</Typography>
        </Box>
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
          label="Buying Price"
          type="number"
          value={buyingPrice}
          onChange={(e) => setBuyingPrice(e.target.value)}
          required
        />

        <TextField
          label="Selling Price"
          type="number"
          value={sellingPrice}
          onChange={(e) => setSellingPrice(e.target.value)}
          required
        />
        {buyingPrice !== "" && sellingPrice !== "" && (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: "12px",
              backgroundColor: isProfit ? "success.light" : "error.light",
              color: isProfit ? "success.dark" : "error.dark",
              fontWeight: 600,
              boxShadow: 1,
            }}
          >
            <Typography variant="subtitle2">
              {isProfit ? "Profit" : "Loss"}
            </Typography>
            <Typography variant="subtitle1">
              ${Math.abs(Number(profit)).toFixed(2)}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}>
          <Button variant="contained" type="submit">
            Add Trade
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<Refresh />}
            onClick={clearForm}
          >
            Clear
          </Button>
        </Box>
      </Box>
      <Button
        variant="contained"
        sx={{ padding: 1, mt: 2 }}
        startIcon={<ArrowLeft />}
        onClick={() => router.push("/trades?accountId=" + accountId)}
      >
        Back
      </Button>
    </>
  );
}
