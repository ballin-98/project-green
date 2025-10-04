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
    <Box sx={{ width: "400px" }}>
      <Typography variant="body2" color="text.primary" mb={0.5}>
        {label}
      </Typography>

      {/* Progress bar with side numbers */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {/* Start value */}
        <Typography variant="body2" sx={{ mr: 1 }}>
          $0
        </Typography>

        {/* Bar container */}
        <Box sx={{ flex: 1, position: "relative" }}>
          <LinearProgress
            variant="determinate"
            value={value}
            sx={{
              height: 30,
              borderRadius: 6,
              backgroundColor: "#E0E0E0",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#2ECC71",
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
