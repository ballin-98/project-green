"use client";

import { Box, Typography } from "@mui/material";
import { ClientStockData, TradeInfo } from "../lib/types";
import { useEffect, useState } from "react";
import TotalCard from "./TotalCard";
import ProgressBar from "./ProgressBar";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import TradeList from "./TradeList";
import {
  divFreqToString,
  calculateMonthlyDividends,
  calculateYearlyDividends,
  calculateTotalAssets,
} from "../lib/utils/dashboardHelpers";

interface DashboardProps {
  stocks: ClientStockData[];
  trades: TradeInfo[];
}

export default function Dashboard({ stocks, trades }: DashboardProps) {
  const [monthlyDividends, setMonthlyDividends] = useState(0);
  const [assetValue, setAssetValue] = useState(0);
  const [yearlyDividends, setYearlyDividends] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setAssetValue(calculateTotalAssets(stocks));
    setMonthlyDividends(calculateMonthlyDividends(stocks));
    setYearlyDividends(calculateYearlyDividends(stocks));
  }, [stocks]);

  if (!mounted) return null;

  const sortModel: GridSortModel = [{ field: "new", sort: "desc" }];

  const columns: GridColDef[] = [
    { field: "name", headerName: "Ticker", flex: 1, minWidth: 100 },
    { field: "price", headerName: "Price", flex: 1, minWidth: 100 },
    { field: "quantity", headerName: "Quantity", flex: 1, minWidth: 100 },
    {
      field: "dividendFrequency",
      headerName: "Frequency",
      flex: 1,
      minWidth: 100,
      valueGetter: (_, row) => divFreqToString(row.dividendFrequency),
    },
    {
      field: "mostRecentDividend",
      headerName: "Dividend",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "new",
      headerName: "Income",
      minWidth: 200,
      valueGetter: (_, row) =>
        ((row.mostRecentDividend ?? 0) * row.quantity).toFixed(2),
      sortComparator: (v1, v2) => (Number(v1) ?? 0) - (Number(v2) ?? 0),
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        paddingY: 1,
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flex: 1,
          gap: 2,
          minHeight: 0, // crucial for flex children to shrink
          flexDirection: { xs: "column", md: "row" }, // responsive stacking
        }}
      >
        {/* Left column */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 7,
            gap: 2,
            minHeight: 0,
          }}
        >
          {/* Total Cards */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TotalCard totalDividends={assetValue} label="Asset Value" />
            <TotalCard
              totalDividends={monthlyDividends}
              label="Monthly Dividends"
            />
            <TotalCard
              totalDividends={yearlyDividends}
              label="Yearly Dividends"
            />
          </Box>

          {/* DataGrid */}
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <DataGrid
              rows={stocks}
              columns={columns}
              sortModel={sortModel}
              sx={{ flex: 1, minHeight: 0 }}
            />
          </Box>
        </Box>

        {/* Right column */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 3,
            gap: 2,
            minWidth: { md: 300 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              boxShadow: 3,
              p: 2,
              borderRadius: 2,
              backgroundColor: "white",
            }}
          >
            <Typography variant="h5">Goal Summary</Typography>
            <ProgressBar
              current={monthlyDividends}
              goal={600}
              label="Monthly Dividend"
            />
            <ProgressBar
              current={yearlyDividends}
              goal={8000}
              label="Yearly Income"
            />
          </Box>
          <TradeList trades={trades} />
        </Box>
      </Box>
    </Box>
  );
}
