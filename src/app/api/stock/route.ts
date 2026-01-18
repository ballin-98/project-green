import { StockData } from "@/app/lib/types";
import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const getFirstOfMonth = (monthsBack: number): string => {
  const date = new Date();
  date.setMonth(date.getMonth() - monthsBack);
  date.setDate(1);
  return date.toISOString().split("T")[0];
};

// need better logic here for dividends
const stockDividendCache = {
  "CDAY.NE": 0.366,
  "CDAY.TO": 0.366,
  "BIGY.TO": 0.625,
  "SDAY.NE": 0.364,
  "SDAY.TO": 0.364,
  "AGCC.NE": 0.135,
  "HHLE.TO": 0.0934,
} as {
  [key: string]: number;
};

// this should load data for a specific stock
export async function GET(req: Request): Promise<NextResponse<StockData[]>> {
  const stockResponse: StockData[] = [];
  const url = new URL(req.url);
  const ticker = url.searchParams.get("ticker");
  // console.log("ticker:", ticker);

  if (!ticker) {
    return NextResponse.json(stockResponse);
  }

  const firstOfLastMonth = getFirstOfMonth(3);
  // console.log("first of month:", firstOfLastMonth);
  // function to get last month date as string
  try {
    const yahooFinance = new YahooFinance();
    const result = await yahooFinance.chart(ticker, {
      period1: firstOfLastMonth,
      period2: new Date(),
      interval: "1d",
      events: "div",
    });
    let mostRecentDividend = 0;

    if (result.events?.dividends) {
      mostRecentDividend =
        result.events?.dividends[result?.events?.dividends.length - 1].amount;
    } else {
      mostRecentDividend = stockDividendCache[ticker] || 0;
    }

    // this is hard coded to get more precision for HHLE.TO
    if (ticker === "HHLE.TO") {
      mostRecentDividend = 0.0934;
    }
    stockResponse.push({
      symbol: result.meta.symbol,
      // @ts-expect-error type error
      name: result.meta.shortName,
      mostRecentDividend: mostRecentDividend,
      price: result.meta.regularMarketPrice || 0,
    });
  } catch (error) {
    console.error(`Error fetching data for ticker ${ticker}:`, error);
  }

  return NextResponse.json(stockResponse);
}
