"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Chip, IconButton } from "@mui/material";
import { GoalInfo, TradeInfo } from "../lib/types";
import { useEffect, useState } from "react";
import TotalCard from "./TotalCard";
import ProgressBar from "./ProgressBar";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSortModel,
} from "@mui/x-data-grid";
import TradeList from "./TradeList";
import {
  divFreqToString,
  calculateMonthlyDividends,
  calculateYearlyDividends,
  calculateTotalAssets,
} from "../lib/utils/dashboardHelpers";
import { Edit, Delete } from "@mui/icons-material";
import {
  deleteStock,
  // getStock,
  getTrades,
  getGoals,
} from "../lib/stockService";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import { useStockContext } from "../context/StockProvider";
// import useSWR from "swr";

export interface AppUser {
  email: string;
  id: string;
}

export default function Dashboard() {
  const [monthlyDividends, setMonthlyDividends] = useState(0);
  const [assetValue, setAssetValue] = useState(0);
  const [yearlyDividends, setYearlyDividends] = useState(0);
  const [trades, setTrades] = useState<TradeInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<GoalInfo | undefined>(undefined);
  const router = useRouter();
  const { user } = useUser();

  const { stocks } = useStockContext();

  // run this once we have a user
  useEffect(() => {
    if (!user || !stocks) return;
    const fetchData = async () => {
      try {
        const [tradeData, goalData] = await Promise.all([
          getTrades(user?.id ?? ""),
          getGoals(user?.id ?? ""),
        ]);
        setTrades(tradeData);
        if (goalData) {
          setGoals(goalData);
        }
        setAssetValue(calculateTotalAssets(stocks));
        setMonthlyDividends(calculateMonthlyDividends(stocks));
        setYearlyDividends(calculateYearlyDividends(stocks));
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, stocks]);

  const handleEdit = (params: any) => {
    router.push(
      `/stock/edit?name=${params.name}&qt=${params.questTrade}&ws=${params.wealthSimple}&df=${params.dividendFrequency}`
    );
  };

  const handleDelete = async (params: any) => {
    setLoading(true);
    await deleteStock(user?.id ?? "", params.name);
    router.refresh();
    setLoading(false);
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
      renderCell: (params) => {
        const value = params.value;

        const colors: Record<string, { bg: string }> = {
          Monthly: { bg: "#9cf09eff" },
          Quarterly: { bg: "#D1B3FF" },
        };

        return (
          <Box>
            <Chip
              label={value}
              sx={{
                backgroundColor: colors[value]?.bg || "#E0E0E0",
                fontWeight: 500,
                height: 32,
              }}
              size="medium"
            />
          </Box>
        );
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
      valueGetter: (_, row) =>
        ((row.mostRecentDividend ?? 0) * row.quantity).toFixed(2),
      sortComparator: (v1, v2) => (Number(v1) ?? 0) - (Number(v2) ?? 0),
    },
    {
      field: "actions",
      headerName: "",
      sortable: false,
      minWidth: 60,
      flex: 0.5,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            flexDirection: "row",
            gap: 1,
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            height: "100%",
          }}
        >
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEdit(params.row)}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(params.row)}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        paddingY: 1,
        boxSizing: "border-box",
        gap: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flex: 1,
          gap: 2,
          minHeight: 0,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Left column */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 9,
            gap: 2,
            minHeight: 0,
          }}
        >
          {/* Total Cards */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              marginBottom: 2,
              justifyContent: "center",
              alignItems: "center",
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
              justifyContent: "center",
              alignItems: "center",
              boxShadow: 2,
              borderRadius: 3,
              padding: 1,
            }}
          >
            <ProgressBar
              current={monthlyDividends}
              goal={Number(goals?.shortTermGoal ?? 750)}
              label="Monthly Dividend"
            />
            <ProgressBar
              current={yearlyDividends}
              goal={Number(goals?.longTermGoal ?? 8000)}
              label="Yearly Income"
            />
          </Box>
          <TradeList trades={trades} />
        </Box>
      </Box>
    </Box>
  );
}
