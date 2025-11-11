"use client";

import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { createClientSideClient } from "../lib/supabaseClientSide";

export default function AppHeader() {
  const router = useRouter();
  useEffect(() => setMounted(true), []);
  const { user, setUser } = useUser();
  const [mounted, setMounted] = useState(false);
  if (!mounted) return null; // render nothing until mounted

  const handleLogout = async () => {
    const supabase = await createClientSideClient();

    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();

    if (!error) {
      setUser(undefined);
      window.location.href = "/";
    } else {
      console.error("Logout error:", error.message);
    }
  };

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
          {user && (
            <>
              <Button color="inherit" onClick={() => router.push("/stocks")}>
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
              <Button
                color="inherit"
                onClick={() => router.push("/projections")}
              >
                Projections
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Sign Out
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
