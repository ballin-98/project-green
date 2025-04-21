import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get("ticker") || "AAPL";

  const res = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch stock data" },
      { status: 500 }
    );
  }
  const data = await res.json();
  return NextResponse.json(data, { status: 200 });
}
