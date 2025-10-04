"use client";

import { Box, Typography } from "@mui/material";
import { ClientStockData, TradeInfo } from "../lib/types";
import { useEffect, useState } from "react";
import TotalCard from "./TotalCard";
import DashboardHeader from "./Header";
import ProgressBar from "./ProgressBar";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import TradeList from "./TradeList";

interface DashboardProps {
  stocks: ClientStockData[];
  trades: TradeInfo[];
}

export const divFreqToString = (freq: number) => {
  switch (freq) {
    case 12:
      return "Monthly";
    case 4:
      return "Quarterly";
    default:
      return "N/A";
  }
};

export default function Dashboard({ stocks, trades }: DashboardProps) {
  const [monthlyDividends, setMonthlyDividends] = useState(0);
  const [assetValue, setAssetValue] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [yearlyDividends, setYearlyDividends] = useState(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const calculateTotal = () => {
      let total = 0;
      stocks.forEach((stock) => {
        total += (stock.price ?? 0) * stock.quantity;
      });
      setAssetValue(total);
    };
    calculateTotal();
  }, [stocks]);

  useEffect(() => {
    const calculateTotalDividends = () => {
      let total = 0;
      stocks.forEach((stock) => {
        if (stock.dividendFrequency === 12) {
          total += (stock.mostRecentDividend ?? 0) * stock.quantity;
        }
      });
      setMonthlyDividends(total);
    };
    calculateTotalDividends();
  }, [stocks]);

  useEffect(() => {
    const calculateTotalDividends = () => {
      let total = 0;
      stocks.forEach((stock) => {
        total +=
          (stock.mostRecentDividend ?? 0) *
          stock.quantity *
          stock.dividendFrequency;
      });
      setYearlyDividends(total);
    };
    calculateTotalDividends();
  }, [stocks]);

  if (!mounted) return null; // render nothing until mounted

  const sortModel: GridSortModel = [
    { field: "new", sort: "desc" }, // always sort by price descending
  ];

  const columns: GridColDef[] = [
    { field: "name", headerName: "Ticker", flex: 1, minWidth: 100 },
    { field: "price", headerName: "Price", flex: 1, minWidth: 100 },
    { field: "quantity", headerName: "Quantity", flex: 1, minWidth: 100 },
    {
      field: "dividendFrequency",
      headerName: "Frequency",
      flex: 1,
      minWidth: 100,
      valueGetter: (value, row) => {
        if (!row.dividendFrequency) {
          return null;
        }
        return divFreqToString(row.dividendFrequency);
      },
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
      valueGetter: (value, row) => {
        if (!row.mostRecentDividend) {
          return null;
        }
        return (row.mostRecentDividend * row.quantity).toFixed(2);
      },
      sortComparator: (v1, v2) => {
        // v1 and v2 are the values returned by valueGetter
        return (v1 ?? 0) - (v2 ?? 0);
      },
    },
  ];

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 1,
          mb: 2,
          height: "100vh",
        }}
      >
        <DashboardHeader />
        <Box display={"flex"} flexDirection="row" gap={2} mt={2}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              marginBottom: 2,
              width: "70%",
              height: "100%",
            }}
          >
            <Box display={"flex"} flexDirection="row" gap={2} width={"100%"}>
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
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                padding: 1,
                width: "100%",
                height: "50%",
              }}
            >
              {stocks && (
                <DataGrid
                  rows={stocks}
                  columns={columns}
                  sortModel={sortModel}
                />
              )}
            </div>
          </Box>
          <Box sx={{ width: "26%" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                boxShadow: 3,
                padding: 2,
                borderRadius: 2,
                backgroundColor: "white",
                width: "100%",
                height: "fit-content",
              }}
            >
              <Typography variant="h5">Goal Summary</Typography>
              <ProgressBar
                current={monthlyDividends}
                goal={600}
                label="Monthly Dividend"
              />
              {/* this will need to include quarterly and also win / losses */}
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
    </>
  );
}
