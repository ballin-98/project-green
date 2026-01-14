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
import { Edit, Delete, Add } from "@mui/icons-material";
import {
  deleteStock,
  // getStock,
  getTrades,
  getGoals,
} from "../lib/stockService";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import { useStockContext } from "../context/StockProvider";
import { deleteAccount, getAccounts, addAccount } from "../lib/accountService";
import AccountTab from "./AccountTab";

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
  const [filteredStocks, setFilteredStocks] = useState(stocks);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [accounts, setAccounts] = useState<any[]>([]);
  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);

  // run this once we have a user
  useEffect(() => {
    if (!user || !stocks) return;
    console.log("all stocks returned from context:", stocks);
    const fetchData = async () => {
      try {
        const [tradeData, goalData, accountData] = await Promise.all([
          getTrades(user?.id ?? ""),
          getGoals(user?.id ?? ""),
          getAccounts(user?.id ?? ""),
        ]);
        setTrades(tradeData);
        if (goalData) {
          setGoals(goalData);
        }
        if (accountData) {
          setAccounts(accountData);
          console.log(accountData);
          setActiveAccountId(accountData[0]?.id);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, stocks]);

  useEffect(() => {
    if (activeAccountId && stocks) {
      const newFilteredStocks = stocks.filter(
        (stock) => stock.accountId === activeAccountId
      );
      setFilteredStocks(newFilteredStocks);
    }
  }, [activeAccountId, stocks]);

  useEffect(() => {
    if (filteredStocks) {
      setAssetValue(calculateTotalAssets(filteredStocks));
      setMonthlyDividends(calculateMonthlyDividends(filteredStocks));
      setYearlyDividends(calculateYearlyDividends(filteredStocks));
    } else {
      setAssetValue(0);
      setMonthlyDividends(0);
      setYearlyDividends(0);
    }
  }, [filteredStocks]);

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

  const onAccountChange = (accountId: string) => {
    setActiveAccountId(accountId);
  };

  const handleAddAccount = async () => {
    if (!user) return;
    await addAccount(user?.id, "New Account");
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
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#e7e2e2",
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-start",
                width: "100%",
              }}
            >
              {accounts.map((account, index) => (
                <AccountTab
                  key={index}
                  accountName={account.nickname ?? "Unnamed Account"}
                  accountId={account.id}
                  isActive={activeAccountId === account.id}
                  //   this needs to be passed in and it's going to act like a filter
                  onDelete={deleteAccount}
                  onSelect={onAccountChange}
                />
              ))}
              <IconButton size="small" sx={{ ml: 1 }}>
                <Add fontSize="small" onClick={handleAddAccount} />
              </IconButton>
            </Box>
            {/* Total Cards */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "flex-start",
                width: "100%",
                paddingBottom: 1,
                marginBottom: 1,
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
              rows={filteredStocks}
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
