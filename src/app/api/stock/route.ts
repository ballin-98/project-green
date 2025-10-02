import { StockData } from "@/app/lib/types";
import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

const stockDividendCache = { "CDAY.NE": 0.362, "BIGY.TO": 0.625 } as {
  [key: string]: number;
};

// this should load data for a specific stock
export async function GET(req: Request): Promise<NextResponse<StockData[]>> {
  const stockResponse: StockData[] = [];
  const url = new URL(req.url);
  const ticker = url.searchParams.get("ticker");

  if (!ticker) {
    return NextResponse.json(stockResponse);
  }

  // function to get last month date as string
  try {
    const result = await yahooFinance.chart(ticker, {
      period1: "2025-06-01",
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

    // hardcoded values to get the proper dividend for some stocks this could probably be a function
    if (ticker === "HHLE.TO") {
      mostRecentDividend = 0.0934;
    }
    if (ticker === "BIGY.TO") {
      mostRecentDividend = stockDividendCache[ticker];
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
