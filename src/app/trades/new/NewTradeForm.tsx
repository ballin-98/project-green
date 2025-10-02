"use client";

import { useEffect, useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { addTrade } from "@/app/lib/stockService";
import { useRouter } from "next/navigation";

export default function TradeForm() {
  const [stockName, setStockName] = useState("");
  const [shares, setShares] = useState<string>("");
  const [profit, setProfit] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const router = useRouter();

  if (!mounted) return null; // render nothing until mounted

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await addTrade(stockName, Number(shares), Number(profit));

    router.push("/");
  };

  return (
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
  );
}
