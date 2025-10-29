"use client";

import { useEffect, useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { updateStock } from "@/app/lib/stockService";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "@mui/icons-material";

export default function EditStockForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  console.log("trying to load");
  // useEffect(() => setMounted(true), []);
  useEffect(() => {
    // Load query parameters once component mounts
    const name = searchParams.get("name");
    const qt = searchParams.get("qt");
    const ws = searchParams.get("ws");
    const df = searchParams.get("df");

    if (name) setStockName(name);
    if (qt) setQuestTrade(qt);
    if (ws) setWealthSimple(ws);
    if (df) setDividendFrequency(df);
  }, [searchParams]);

  const [stockName, setStockName] = useState("");
  const [wealthSimple, setWealthSimple] = useState<string>("");
  const [questTrade, setQuestTrade] = useState<string>("");
  const [dividendFrequency, setDividendFrequency] = useState<string>("");
  // const [mounted, setMounted] = useState(false);
  // if (!mounted) return null; // render nothing until mounted

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateStock(
      stockName,
      Number(questTrade),
      Number(wealthSimple),
      Number(dividendFrequency)
    );
    router.push("/");
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
        <Typography variant="h6">Edit Stock Information</Typography>

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
          Update Stock
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
