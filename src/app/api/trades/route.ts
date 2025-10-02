/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { createClient } from "../../lib/supabaseClient";
import { TradeInfo } from "@/app/lib/types";

export async function GET(): Promise<
  NextResponse<TradeInfo[] | { error: string }>
> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("trades").select("*");

  let tradeData: TradeInfo[] = [];
  if (data) {
    tradeData = data?.map((trade) => ({
      stockName: trade.stock_name,
      shares: trade.shares,
      profit: trade.profit,
      date: trade.created_at, // assuming date is stored as a string in the DB
    }));
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(tradeData);
}

// // save stock to stocks table in supabase db
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const supabase = await createClient();

    // Parse the JSON body from the request
    const { stock_name, shares, profit } = await req.json();
    console.log("Received trade data:", { stock_name, shares, profit });

    // Insert into Supabase, mapping request fields to DB columns
    const { data, error } = await supabase.from("trades").insert([
      {
        stock_name: stock_name,
        shares: shares,
        profit: profit,
      },
    ]);

    if (error) {
      throw error;
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error("Error inserting stock:", err);
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
