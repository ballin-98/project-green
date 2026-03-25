import { ClientStockData } from "../types";

export const divFreqToString = (freq: number) => {
  switch (freq) {
    case 24:
      return "Semi Monthly";
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
        ((stock.quantity ?? 0) + (stock.potential ?? 0)) *
        stock.dividendFrequency,
    0,
  );
};

export const calculateMonthlyDividends = (stocks: ClientStockData[]) => {
  return stocks.reduce((total, stock) => {
    const frequency = stock.dividendFrequency ?? 0;
    const dividend = stock.mostRecentDividend ?? 0;
    const shares = (stock.quantity ?? 0) + (stock.potential ?? 0);

    let monthlyDividend = 0;

    if (frequency === 12) {
      monthlyDividend = dividend;
    } else if (frequency === 24) {
      monthlyDividend = dividend * 2;
    }

    return total + monthlyDividend * shares;
  }, 0);
};

export const calculateTotalAssets = (stocks: ClientStockData[]) => {
  return stocks.reduce(
    (total, stock) =>
      total +
      (stock.price ?? 0) * ((stock.quantity ?? 0) + (stock.potential ?? 0)),
    0,
  );
};

export const calculateCashNeeded = (stocks: ClientStockData[]) => {
  return stocks.reduce(
    (total, stock) => total + (stock.price ?? 0) * (stock.potential ?? 0),
    0,
  );
};
