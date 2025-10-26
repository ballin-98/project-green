"use client";

import { Box, Typography, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function DashboardHeader() {
  const router = useRouter();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 1,
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Box>
        <Typography variant="h4" component="h1">
          Portfolio Overview
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Welcome back! Here is your portfolio snapshot.
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => router.push("/stock/new")}
      >
        Add New Stock
      </Button>
    </Box>
  );
}
