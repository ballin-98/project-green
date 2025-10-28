import { ClientStockData } from "./types";
/* eslint-disable @typescript-eslint/no-explicit-any */

const getBaseUrl = () => {
  console.log("here");
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? `https://${process.env.VERCEL_URL}` // production
      : "http://localhost:3000";
  console.log(
    "[getBaseUrl] NODE_ENV:",
    process.env.NODE_ENV,
    "VERCEL_URL:",
    process.env.VERCEL_URL,
    "baseUrl:",
    baseUrl
  );
  return baseUrl;
};

export const getStock = async (): Promise<ClientStockData[]> => {
  try {
    const baseUrl = getBaseUrl();

    const ownedStocksResponse = await fetch(`${baseUrl}/api/db`);
    const ownedStocksResponseJson = await ownedStocksResponse.json();

    const stockDetailPromises = ownedStocksResponseJson.map(
      async (stock: any) => {
        const stockDetails = await fetch(
          `${baseUrl}/api/stock?ticker=${encodeURIComponent(stock.name)}`
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
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/db`, {
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
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/db`, {
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
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/db`, {
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
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/trades`, {
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
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/trades`, {
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
