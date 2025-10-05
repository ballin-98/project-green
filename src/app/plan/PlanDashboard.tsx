"use client";

import { Box, Typography } from "@mui/material";
import { ClientStockData, TradeInfo } from "../lib/types";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import DashboardHeader from "../stocks/Header";
import ProgressBar from "../stocks/ProgressBar";
import TotalCard from "../stocks/TotalCard";

// this should be renamed
interface DashboardProps {
  stocks: ClientStockData[];
  trades: TradeInfo[];
}

// this can be moved out
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

export default function PlanDashboard({ stocks, trades }: DashboardProps) {
  const [monthlyDividends, setMonthlyDividends] = useState(0);
  const [assetValue, setAssetValue] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [yearlyDividends, setYearlyDividends] = useState(0);
  const [potentialStocks, setPotentialStocks] = useState(stocks);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const calculateTotal = () => {
      let total = 0;
      potentialStocks.forEach((stock) => {
        total += (stock.price ?? 0) * stock.quantity;
        total += (stock.price ?? 0) * stock.potential;
      });
      setAssetValue(total);
    };
    calculateTotal();
  }, [potentialStocks]);

  useEffect(() => {
    const calculateTotalDividends = () => {
      let total = 0;
      potentialStocks.forEach((stock) => {
        if (stock.dividendFrequency === 12) {
          total += (stock.mostRecentDividend ?? 0) * stock.quantity;
          total += (stock.mostRecentDividend ?? 0) * stock.potential;
        }
      });
      setMonthlyDividends(total);
    };
    calculateTotalDividends();
  }, [potentialStocks]);

  useEffect(() => {
    const calculateTotalDividends = () => {
      let total = 0;
      potentialStocks.forEach((stock) => {
        total +=
          (stock.mostRecentDividend ?? 0) *
          stock.quantity *
          stock.dividendFrequency;
        total +=
          (stock.mostRecentDividend ?? 0) *
          stock.potential *
          stock.dividendFrequency;
      });
      setYearlyDividends(total);
    };
    calculateTotalDividends();
  }, [potentialStocks]);

  // render nothing until mounted => do this to avoid hydration errors
  if (!mounted) return null;

  const updateStock = (id: number, potential: number, cash: number) => {
    const updatedStocks = potentialStocks.map((stock) =>
      stock.id === id ? { ...stock, potential: potential, cash: cash } : stock
    );
    console.log("updated potential stocks: ", updatedStocks);
    setPotentialStocks(updatedStocks);
  };

  const handleRowUpdate = (newRow) => {
    console.log("new row: ", newRow);
    const potential =
      newRow.cash && newRow.price ? Math.floor(newRow.cash / newRow.price) : 0;
    console.log("potential being calculated in handle row update: ", potential);
    // update just this stock
    updateStock(newRow.id, potential, newRow.cash ?? 0);

    return { ...newRow, potential }; // ensures DataGrid shows updated value
  };

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
      minWidth: 100,
    },
    {
      field: "cash",
      headerName: "Cash",
      minWidth: 100,
      editable: true,
    },
    {
      field: "potential",
      headerName: "Potential Shares",
      minWidth: 120,
    },
    {
      field: "new",
      headerName: "Income",
      minWidth: 100,
      valueGetter: (value, row) => {
        const dividend = row.mostRecentDividend ?? 0;
        const quantity = row.quantity ?? 0;
        const price = row.price ?? 0;
        const cash = row.cash ?? 0;

        const potentialShares = price && cash ? Math.floor(cash / price) : 0;

        return (dividend * quantity + dividend * potentialShares).toFixed(2);
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
                  rows={potentialStocks}
                  columns={columns}
                  sortModel={sortModel}
                  processRowUpdate={handleRowUpdate}
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
            <Box
              display={"flex"}
              flexDirection="column"
              gap={2}
              mt={2}
              flex={1}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  flex: 1,
                }}
              >
                <TotalCard totalDividends={assetValue} label="Asset Value" />
                <TotalCard
                  totalDividends={monthlyDividends}
                  label="Monthly Dividends"
                />
              </Box>
              <TotalCard
                totalDividends={yearlyDividends}
                label="Yearly Dividends"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
