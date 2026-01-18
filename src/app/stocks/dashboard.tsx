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
import {
  deleteAccount,
  getAccounts,
  addAccount,
  getAccountsKey,
} from "../lib/accountService";
import AccountTab from "./AccountTab";
import useSWR, { mutate } from "swr";

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
  // const searchParams = useSearchParams();

  const { data: accountsData = [] } = useSWR(
    user ? getAccountsKey(user.id) : null,
    () => getAccounts(user!.id),
  );

  const { stocks } = useStockContext();
  const [filteredStocks, setFilteredStocks] = useState(stocks);
  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);

  useEffect(() => {
    if (accountsData.length > 0 && !activeAccountId) {
      setActiveAccountId(accountsData[0]?.id);
    }
  }, [accountsData, activeAccountId]);

  useEffect(() => {
    if (!activeAccountId) return;

    const params = new URLSearchParams(window.location.search);
    params.set("accountId", activeAccountId);

    // Replace URL without reloading page
    router.replace(`?${params.toString()}`);
  }, [activeAccountId, router]);

  // run this once we have a user
  useEffect(() => {
    if (!user || !stocks) return;
    const fetchData = async () => {
      try {
        const [goalData] = await Promise.all([getGoals(user?.id ?? "")]);
        if (goalData) {
          setGoals(goalData);
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
        (stock) => stock.accountId === activeAccountId,
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

  useEffect(() => {
    if (!activeAccountId && !user) return;
    const fetchTrades = async () => {
      try {
        const tradesData = await getTrades(user?.id ?? "", activeAccountId!);
        setTrades(tradesData);
      } catch (err) {
        console.error("Error fetching trades:", err);
      }
    };
    fetchTrades();
  }, [activeAccountId, user]);

  const handleEdit = (params: any) => {
    router.push(
      `/stock/edit?name=${params.name}&quantity=${params.quantity}&df=${params.dividendFrequency}&accountId=${params.accountId}`,
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
    console.log("calling mutate for accounts");
    mutate(getAccountsKey(user.id));
  };

  const handleDeleteAccount = async (accountId: string, index: number) => {
    if (!user) return;
    let newActiveId: string = "";
    if (activeAccountId === accountId) {
      // Choose previous account in the list, or next if first deleted
      newActiveId =
        accountsData[index - 1]?.id || accountsData[index + 1]?.id || "";
    }
    await deleteAccount(accountId);
    mutate(getAccountsKey(user.id));
    setActiveAccountId(newActiveId);
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
              backgroundColor: "#ffffff",
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
              }}
            >
              {accountsData.map((account, index) => (
                <AccountTab
                  key={index}
                  accountIndex={index}
                  accountName={account.nickname ?? "Unnamed Account"}
                  accountId={account.id}
                  isActive={activeAccountId === account.id}
                  //   this needs to be passed in and it's going to act like a filter
                  onDelete={handleDeleteAccount}
                  onSelect={onAccountChange}
                />
              ))}
              <Box
                sx={{
                  height: "30px",
                  width: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconButton
                  size="small"
                  onClick={handleAddAccount}
                  sx={{
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <Add fontSize="small" />
                </IconButton>
              </Box>
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
            backgroundColor: "#ffffff",
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
          {activeAccountId && trades && (
            <TradeList trades={trades} accountId={activeAccountId} />
          )}
        </Box>
      </Box>
    </Box>
  );
}
