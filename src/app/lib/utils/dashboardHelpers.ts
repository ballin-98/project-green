import { ClientStockData } from "../types";

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

export const calculateYearlyDividends = (stocks: ClientStockData[]) => {
  return stocks.reduce(
    (total, stock) =>
      total +
      (stock.mostRecentDividend ?? 0) *
        stock.quantity *
        stock.dividendFrequency,
    0
  );
};

export const calculateMonthlyDividends = (stocks: ClientStockData[]) => {
  return stocks.reduce(
    (total, stock) =>
      total +
      (stock.dividendFrequency === 12 ? stock.mostRecentDividend ?? 0 : 0) *
        stock.quantity,
    0
  );
};

export const calculateTotalAssets = (stocks: ClientStockData[]) => {
  return stocks.reduce(
    (total, stock) => total + (stock.price ?? 0) * stock.quantity,
    0
  );
};
