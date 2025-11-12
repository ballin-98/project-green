import { ClientStockData, GoalInfo } from "./types";
/* eslint-disable @typescript-eslint/no-explicit-any */

let cachedGoals: GoalInfo | undefined = undefined;

// this will need to be updated later in case the goals change => invalidate cache
// for now this is fine
const handleCachedGoals = (goalsData?: GoalInfo) => {
  if (!cachedGoals && goalsData) {
    cachedGoals = goalsData;
  }
  return cachedGoals;
};

export const getStock = async (userId: string): Promise<ClientStockData[]> => {
  try {
    const ownedStocksResponse = await fetch(`/api/db?userId=${userId}`);
    const ownedStocksResponseJson = await ownedStocksResponse.json();

    const stockDetailPromises = ownedStocksResponseJson.map(
      async (stock: any) => {
        const stockDetails = await fetch(
          `/api/stock?ticker=${encodeURIComponent(stock.name)}`
        );
        const stockDetailsJson = await stockDetails.json();

        return {
          id: stock.id,
          name: stock.name,
          quantity: stock.quantity,
          potential: stock.potential,
          mostRecentDividend: stockDetailsJson[0].mostRecentDividend,
          price: stockDetailsJson[0].price,
          wealthSimple: stock.wealthSimple,
          questTrade: stock.questTrade,
          dividendFrequency: stock.dividendFrequency,
        } as ClientStockData;
      }
    );
    return await Promise.all(stockDetailPromises);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return [];
  }
};

export const addNewStock = async (
  userId: string,
  name: string,
  questTrade: number,
  wealthSimple: number,
  dividendFrequency?: number
) => {
  try {
    const response = await fetch(`/api/db`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        name,
        quest_trade: questTrade,
        wealth_simple: wealthSimple,
        dividend_frequency: dividendFrequency,
      }),
    });
    return response.json();
  } catch (error) {
    console.error("Error adding new stock:", error);
  }
};

export const updateStock = async (
  userId: string,
  name: string,
  questTrade: number,
  wealthSimple: number,
  id: number,
  dividendFrequency?: number
) => {
  try {
    const response = await fetch(`/api/db`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        name,
        quest_trade: questTrade,
        wealth_simple: wealthSimple,
        dividend_frequency: dividendFrequency,
        id,
      }),
    });
    return response.json();
  } catch (error) {
    console.error("Error updating stock:", error);
  }
};

export const deleteStock = async (userId: string, stockName: string) => {
  try {
    const response = await fetch(`/api/db`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        stock_name: stockName,
      }),
    });
    return response.json();
  } catch (error) {
    console.error("Error deleting stock:", error);
  }
};

export const getTrades = async (userId: string) => {
  try {
    const response = await fetch(`/api/trades?userId=${userId}`, {
      cache: "no-store",
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching trades:", error);
    return [];
  }
};

export const addTrade = async (
  userId: string,
  stock_name: string,
  shares: number,
  profit: number
) => {
  try {
    const response = await fetch(`/api/trades`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        stock_name: stock_name,
        shares: shares,
        profit: profit,
      }),
    });
    return response.json();
  } catch (error) {
    console.error("Error adding trade:", error);
  }
};

// const defaultGoals: GoalInfo = {
//   longTermGoal: 8000,
//   shortTermGoal: 600,
// };

export const getGoals = async (userId: string) => {
  try {
    const goals = handleCachedGoals();
    if (goals) {
      return goals;
    }
    const response = await fetch(`/api/goals?userId=${userId}`, {
      cache: "no-store",
    });

    const jsonResponse = await response.json();
    // console.log("Fetched goals from API:", jsonResponse);

    handleCachedGoals(jsonResponse.goals);
    // console.log("Cached goals:", cachedGoals);
    // console.log("Returning goals:", jsonResponse.goals);
    // console.log("Returning goals:", jsonResponse);
    return jsonResponse;
  } catch (error) {
    console.error("Error fetching trades:", error);
    return [];
  }
};
