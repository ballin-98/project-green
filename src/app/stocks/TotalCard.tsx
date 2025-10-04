import { Box, Typography } from "@mui/material";

export interface TotalCardProps {
  totalDividends: number;
  label: string;
}

export default function TotalCard({ totalDividends, label }: TotalCardProps) {
  return (
    <Box
      sx={{
        boxShadow: 3,
        width: "100%",
        borderRadius: 2,
        backgroundColor: "white",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "left",
          flexDirection: "column",
          padding: 1,
          gap: 1,
        }}
      >
        <Typography variant="h6" component="span">
          {label}
        </Typography>
        <Typography variant="h4" component="span">
          ${totalDividends.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
}
