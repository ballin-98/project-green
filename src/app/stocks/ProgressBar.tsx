"use client";

import { LinearProgress, Box, Typography } from "@mui/material";

export interface ProgressBarProps {
  current: number;
  goal: number;
  label: string;
}

export default function ProgressBar({
  current,
  goal,
  label,
}: ProgressBarProps) {
  const value = (current / goal) * 100 || 0;

  return (
    <Box sx={{ width: "100%", minWidth: 300, height: "100%" }}>
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

      {/* Progress bar with side numbers */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Start value */}
        <Typography variant="body2" sx={{ mr: 1 }}>
          $0
        </Typography>

        {/* Bar container */}
        <Box sx={{ position: "relative", width: "80%" }}>
          <LinearProgress
            variant="determinate"
            value={value}
            sx={{
              height: 30,
              borderRadius: 6,
              backgroundColor: "#E0E0E0",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#1976d2",
              },
            }}
          />
        </Box>

        {/* End value */}
        <Typography variant="body2" sx={{ ml: 1 }}>
          ${goal.toFixed(0)}
        </Typography>
      </Box>
    </Box>
  );
}
