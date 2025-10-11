"use client";

import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AppHeader() {
  const router = useRouter();
  useEffect(() => setMounted(true), []);
  const [mounted, setMounted] = useState(false);
  if (!mounted) return null; // render nothing until mounted

  return (
    <AppBar
      position="sticky"
      elevation={2}
      sx={{ background: "white", color: "black" }}
    >
      <Toolbar
        sx={{
          minHeight: "48px",
          paddingX: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h6"
          sx={{ margin: 0 }}
          onClick={() => router.push("/")}
        >
          Portfolio Overview
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" onClick={() => router.push("/")}>
            Home
          </Button>
          <Button color="inherit" onClick={() => router.push("/stock/new")}>
            New Stock
          </Button>
          <Button color="inherit" onClick={() => router.push("/trades")}>
            Trades
          </Button>
          <Button color="inherit" onClick={() => router.push("/plan")}>
            Plan
          </Button>
          <Button color="inherit" onClick={() => router.push("/projections")}>
            Projections
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
