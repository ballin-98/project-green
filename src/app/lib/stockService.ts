import { ClientStockData } from "./types";
/* eslint-disable @typescript-eslint/no-explicit-any */

export const getStock = async (): Promise<ClientStockData[]> => {
  try {
    const ownedStocksResponse = await fetch(`/api/db`);
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

export const deleteStock = async (stockName: string) => {
  try {
    const response = await fetch(`/api/db`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stock_name: stockName,
      }),
    });
    return response.json();
  } catch (error) {
    console.error("Error deleting stock:", error);
  }
};

export const getTrades = async () => {
  try {
    const response = await fetch(`/api/trades`, {
      cache: "no-store",
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching trades:", error);
    return [];
  }
};

export const addTrade = async (
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

export const getGoals = async () => {
  try {
    const response = await fetch(`/api/goals`, {
      cache: "no-store",
    });
    const jsonResponse = await response.json();
    return jsonResponse.goals;
  } catch (error) {
    console.error("Error fetching trades:", error);
    return [];
  }
};
