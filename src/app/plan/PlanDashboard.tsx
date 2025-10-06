"use client";

import { Box, Typography } from "@mui/material";
import { ClientStockData } from "../lib/types";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import ProgressBar from "../stocks/ProgressBar";
import TotalCard from "../stocks/TotalCard";
import {
  divFreqToString,
  calculateMonthlyDividends,
  calculateYearlyDividends,
  calculateTotalAssets,
  calculateCashNeeded,
} from "../lib/utils/dashboardHelpers";

interface DashboardProps {
  stocks: ClientStockData[];
}

export default function PlanDashboard({ stocks }: DashboardProps) {
  const [monthlyDividends, setMonthlyDividends] = useState(0);
  const [assetValue, setAssetValue] = useState(0);
  const [yearlyDividends, setYearlyDividends] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [potentialStocks, setPotentialStocks] = useState(stocks);
  const [cash, setCash] = useState(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setAssetValue(calculateTotalAssets(potentialStocks));
    setMonthlyDividends(calculateMonthlyDividends(potentialStocks));
    setYearlyDividends(calculateYearlyDividends(potentialStocks));
    setCash(calculateCashNeeded(potentialStocks));
  }, [potentialStocks]);

  if (!mounted) return null;

  const updateStock = (id: number, potential: number, cash: number) => {
    const updatedStocks = potentialStocks.map((stock) =>
      stock.id === id ? { ...stock, potential, cash } : stock
    );
    setPotentialStocks(updatedStocks);
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const handleRowUpdate = (newRow: any) => {
    const potential =
      newRow.cash && newRow.price ? Math.floor(newRow.cash / newRow.price) : 0;
    updateStock(newRow.id, potential, newRow.cash ?? 0);
    return { ...newRow, potential };
  };

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
      minWidth: 100,
    },
    {
      field: "yield",
      headerName: "Current Yield",
      flex: 1,
      minWidth: 100,
      valueGetter: (_, row) => {
        const dividend = row.mostRecentDividend ?? 0;
        const actualDividend =
          ((dividend * row.dividendFrequency) / row.price) * 100;
        return `${actualDividend.toFixed(2)}%`;
      },
    },
    { field: "cash", headerName: "Cash", minWidth: 100, editable: true },
    { field: "potential", headerName: "Potential Shares", minWidth: 120 },
    {
      field: "new",
      headerName: "Income",
      minWidth: 100,
      valueGetter: (_, row) => {
        const dividend = row.mostRecentDividend ?? 0;
        const totalShares = row.quantity + (row.potential ?? 0);
        return (dividend * totalShares).toFixed(2);
      },
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
          }}
        >
          {/* DataGrid */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              height: "80%%",
            }}
          >
            <DataGrid
              rows={potentialStocks}
              columns={columns}
              sortModel={sortModel}
              processRowUpdate={handleRowUpdate}
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
            height: "auto", // let it size naturally
          }}
        >
          {/* Goal summary */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              boxShadow: 3,
              p: 2,
              borderRadius: 2,
              backgroundColor: "white",
              height: "auto", // natural height
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
              goal={12000}
              label="Yearly Income"
            />
          </Box>

          {/* Total cards */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              flexWrap: "wrap",
              minWidth: "300px",
            }}
          >
            <TotalCard totalDividends={assetValue} label="Asset Value" />
            <TotalCard
              totalDividends={monthlyDividends}
              label="Monthly Dividends"
            />
            <TotalCard
              totalDividends={yearlyDividends}
              label="Yearly Dividends"
            />
            <TotalCard totalDividends={cash} label="Cash Required" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
