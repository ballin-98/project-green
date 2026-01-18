/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../lib/supabaseClient";
import { TradeInfo } from "@/app/lib/types";

export async function GET(
  req: NextRequest,
): Promise<NextResponse<TradeInfo[] | { error: string }>> {
  const supabase = await createClient();
  // parse the URL
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const account_id = searchParams.get("accountId");
  console.log("account id used in the query: ", account_id);
  const { data, error } = await supabase
    .from("trades")
    .select("*")
    .eq("user_id", userId)
    .eq("account_id", account_id)
    .order("created_at", { ascending: false });

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
    const { stock_name, shares, profit, user_id, account_id } =
      await req.json();

    // Insert into Supabase, mapping request fields to DB columns
    const { data, error } = await supabase.from("trades").insert([
      {
        user_id,
        account_id,
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
