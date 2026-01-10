"use client";

import { Button, Card, CardContent, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { createClientSideClient } from "../lib/supabaseClientSide";
import { useUser } from "../context/UserContext";

export default function LoginPage() {
  const handleLogin = async () => {
    const supabase = await createClientSideClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_GAUTH_REDIRECT}/stocks`,
      },
    });
    if (error) {
      console.error("Error during Google login...", error);
      return;
    }
    window.location.href = data.url!;
  };

  const { user } = useUser();

  if (user !== undefined) {
    window.location.href = "/stocks";
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
        fontFamily: "Roboto, sans-serif",
      }}
    >
      <Card
        sx={{
          padding: 4,
          minWidth: 300,
          textAlign: "center",
          boxShadow: 6,
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            sx={{ marginBottom: 2, fontWeight: "bold", color: "#333" }}
          >
            Welcome
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 3, color: "#555" }}>
            Sign in to access your dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<GoogleIcon />}
            sx={{
              backgroundColor: "#4285F4",
              color: "#fff",
              "&:hover": { backgroundColor: "#357ae8" },
              textTransform: "none",
              width: "100%",
              padding: "10px 0",
              fontSize: "16px",
              fontWeight: "bold",
            }}
            onClick={handleLogin}
          >
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
