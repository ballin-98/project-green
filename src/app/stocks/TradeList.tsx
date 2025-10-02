import { TradeInfo } from "../lib/types";
import { Card, CardContent, Typography, Stack, Box } from "@mui/material";

export interface TradeListProps {
  trades: TradeInfo[];
}

export default function TradeList({ trades }: TradeListProps) {
  if (trades.length === 0) {
    return <Typography>No trades available.</Typography>;
  }

  return (
    <Box
      sx={{
        marginTop: 2,
        paddingX: 2,
        borderRadius: 2,
        height: 400, // fixed height
        width: "100%",
        boxShadow: 3,
        backgroundColor: "white",
        overflowY: "auto", // ✅ makes the list scrollable
      }}
    >
      {/* Sticky header */}
      <Typography
        variant="h6"
        sx={{
          position: "sticky",
          top: 0,
          backgroundColor: "white",
          zIndex: 10,
          p: 1,
          height: 40,
        }}
      >
        Recent Trades
      </Typography>
      <Box sx={{ zIndex: 1 }}>
        <Stack>
          {trades.map((trade, index) => (
            <Card key={index} variant="outlined">
              <CardContent>
                <Typography variant="h6">{trade.stockName}</Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    mt: 1,
                  }}
                >
                  <Typography variant="body2">
                    ${trade.profit.toFixed(2)}
                  </Typography>
                  <Typography variant="body2">
                    Shares: {trade.shares}
                  </Typography>
                  <Typography variant="body2">
                    Date: {new Date(trade.date).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
