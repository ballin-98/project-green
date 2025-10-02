"use client";

import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { addNewStock } from "@/app/lib/stockService";
import { useRouter } from "next/navigation";

export default function StockForm() {
  const [stockName, setStockName] = useState("");
  const [wealthSimple, setWealthSimple] = useState<string>("");
  const [questTrade, setQuestTrade] = useState<string>("");
  const [dividendFrequency, setDividendFrequency] = useState<string>("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await addNewStock(
      stockName,
      Number(questTrade), // questTrade first
      Number(wealthSimple), // then wealthSimple
      Number(dividendFrequency) // dividendFrequency last
    );
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
      <Typography variant="h6">New Stock Information</Typography>

      <TextField
        label="Stock Name"
        value={stockName}
        onChange={(e) => setStockName(e.target.value)}
        required
      />

      <TextField
        label="Wealth Simple ($)"
        type="number"
        value={wealthSimple}
        onChange={(e) => setWealthSimple(e.target.value)}
        required
      />

      <TextField
        label="Quest Trade ($)"
        type="number"
        value={questTrade}
        onChange={(e) => setQuestTrade(e.target.value)}
        required
      />

      <TextField
        label="Dividend Frequency (per year)"
        type="number"
        value={dividendFrequency}
        onChange={(e) => setDividendFrequency(e.target.value)}
        required
      />

      <Button variant="contained" type="submit">
        Add Stock
      </Button>
    </Box>
  );
}
