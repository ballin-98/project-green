"use client";

import { Add } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { TradeInfo } from "../lib/types";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Button,
} from "@mui/material";

export interface TradeListProps {
  trades: TradeInfo[];
  accountId: string;
}

export default function TradeList({ trades = [], accountId }: TradeListProps) {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        paddingX: 2,
        borderRadius: 2,
        height: 500, // fixed height
        boxShadow: 3,
        backgroundColor: "white",
        overflowY: "auto", // ✅ makes the list scrollable
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center", // ✅ vertically center both header & button
          px: 1,
          py: 2,
          position: "sticky",
          top: 0,
          backgroundColor: "white",
          zIndex: 10,
        }}
      >
        <Typography variant="h6">Recent Trades</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => router.push(`/trades/new?accountId=${accountId}`)}
        >
          Add Trade
        </Button>
      </Box>
      <Box sx={{ zIndex: 1 }}>
        {trades && (
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
        )}
      </Box>
    </Box>
  );
}
