// return from database
export interface ClientStockData {
  id: number;
  name: string;
  quantity: number;
  potential: number;
  mostRecentDividend?: number | null;
  price: number;
  wealthSimple: number;
  questTrade: number;
  dividendFrequency: number;
}

// returned from stock endpoint
export interface StockData {
  symbol: string;
  name: string;
  mostRecentDividend: number | null;
  price: number;
}

// this will have to refined to be more consistent
// name and symbol are probably the same thing => update db

export interface TradeInfo {
  stockName: string;
  shares: number;
  profit: number;
  date: string; // ISO string
}

export interface GoalInfo {
  longTermGoal: number;
  shortTermGoal: number;
}
