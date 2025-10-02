import { ClientStockData } from "./types";

// for now this will get all the stocks that are saved
// rename variables and clean this up
export const getStock = async (): Promise<ClientStockData[]> => {
  const ownedStocks: ClientStockData[] = [];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const ownedStocksResponse = await fetch(`${baseUrl}/api/db`);
  const ownedStocksResponseJson = await ownedStocksResponse.json();
  // console.log("ownedStocksResponseJson ", ownedStocksResponseJson);

  for (const stock of ownedStocksResponseJson) {
    const stockDetails = await fetch(
      `${baseUrl}/api/stock?ticker=${encodeURIComponent(stock.name)}`,
      {
        cache: "no-store",
      }
    );

    const stockDetailsJson = await stockDetails.json();
    // console.log("stockDetailsJson: ", stockDetailsJson[0].price);

    ownedStocks.push({
      id: stock.id,
      name: stock.name,
      quantity: stock.quantity,
      potential: stock.potential,
      mostRecentDividend: stockDetailsJson[0].mostRecentDividend,
      price: stockDetailsJson[0].price,
      wealthSimple: stock.wealthSimple,
      questTrade: stock.questTrade,
      dividendFrequency: stock.dividendFrequency,
    });
  }

  return ownedStocks;
};

export const addNewStock = async (
  name: string,
  questTrade: number,
  wealthSimple: number,
  dividendFrequency?: number
) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
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
};

export const getTrades = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/trades`, {
    cache: "no-store",
  });
  return response.json();
};

export const addTrade = async (
  stock_name: string,
  shares: number,
  profit: number
) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
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
};
