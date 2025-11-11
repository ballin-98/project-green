"use client";

import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { addNewStock } from "@/app/lib/stockService";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "@mui/icons-material";
import { useUser } from "@/app/context/UserContext";

export default function StockForm() {
  const initialFormState = {
    stockName: "",
    wealthSimple: "",
    questTrade: "",
    dividendFrequency: "",
  };

  const [form, setForm] = useState(initialFormState);
  const { user } = useUser();
  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    await addNewStock(
      user.id,
      form.stockName,
      Number(form.questTrade),
      Number(form.wealthSimple),
      Number(form.dividendFrequency)
    );

    console.log("Finished adding stock");

    // Reset form values
    setForm(initialFormState);

    // Optional: navigate after submission
    // router.push("/stock/new");
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
        <Typography variant="h6">New Stock Information</Typography>

        <TextField
          label="Stock Name"
          value={form.stockName}
          onChange={(e) => handleChange("stockName", e.target.value)}
          required
        />

        <TextField
          label="Wealth Simple ($)"
          type="number"
          value={form.wealthSimple}
          onChange={(e) => handleChange("wealthSimple", e.target.value)}
          required
        />

        <TextField
          label="Quest Trade ($)"
          type="number"
          value={form.questTrade}
          onChange={(e) => handleChange("questTrade", e.target.value)}
          required
        />

        <TextField
          label="Dividend Frequency (per year)"
          type="number"
          value={form.dividendFrequency}
          onChange={(e) => handleChange("dividendFrequency", e.target.value)}
          required
        />

        <Button variant="contained" type="submit">
          Add Stock
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
