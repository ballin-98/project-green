"use client";

import { Box, Typography } from "@mui/material";

export interface TotalCardProps {
  totalDividends: number;
  label: string;
}

export default function TotalCard({
  totalDividends,
  label,
}: {
  totalDividends: number;
  label: string;
}) {
  return (
    <Box
      sx={{
        boxShadow: 2,
        borderRadius: 3,
        flex: 1,
        minWidth: 180,
        width: "100%",
        p: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: 5,
        },
        height: "100%",
      }}
    >
      {/* Small label/header */}
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 600,
          color: "text.secondary",
          letterSpacing: 0.5,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>

      {/* Large main value */}
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          color: "#1976d2", // MUI primary blue
          mt: 0.5,
          lineHeight: 1.1,
        }}
      >
        ${totalDividends.toFixed(2)}
      </Typography>
    </Box>
  );
}
