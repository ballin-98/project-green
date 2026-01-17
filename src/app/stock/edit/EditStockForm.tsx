"use client";

import { useEffect, useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { updateStock } from "@/app/lib/stockService";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "@mui/icons-material";
import { useUser } from "@/app/context/UserContext";
import { useStockContext } from "@/app/context/StockProvider";

export default function EditStockForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate } = useStockContext();

  useEffect(() => {
    // Load query parameters once component mounts
    const name = searchParams.get("name");
    const quantity = searchParams.get("quantity");
    const df = searchParams.get("df");

    if (name) setStockName(name);
    if (quantity) setQuantity(quantity);
    if (df) setDividendFrequency(df);
  }, [searchParams]);

  const [stockName, setStockName] = useState("");
  const [quantity, setQuantity] = useState<string>("");
  const [dividendFrequency, setDividendFrequency] = useState<string>("");
  const accountId = searchParams.get("accountId") || "";
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateStock(
      user?.id ?? "",
      stockName,
      Number(quantity),
      Number(dividendFrequency),
      accountId
    );
    mutate();
    router.push("/stocks");
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
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
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
        onClick={() => router.push("/stocks")}
      >
        Back
      </Button>
    </>
  );
}
