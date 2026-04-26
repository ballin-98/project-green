/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../lib/supabaseClient";
import { TradeInfo } from "@/app/lib/types";
import { sendToLoki } from "@/app/lib/loki";

export async function GET(
  req: NextRequest,
): Promise<NextResponse<TradeInfo[] | { error: string }>> {
  const supabase = await createClient();
  // parse the URL
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const account_id = searchParams.get("accountId");

  let query = supabase
    .from("trades")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  // only filter by account if provided
  if (account_id && account_id !== "all") {
    console.log("somehow in here??");
    query = query.eq("account_id", account_id);
  }

  const { data, error } = await query;

  let tradeData: TradeInfo[] = [];
  if (data) {
    tradeData = data?.map((trade) => ({
      stockName: trade.stock_name,
      shares: trade.shares,
      profit: trade.profit,
      date: trade.created_at, // assuming date is stored as a string in the DB
    }));
  }

  await sendToLoki(
    `Loading trades for user ID ${userId} and account ID ${account_id}`,
    {
      action: "load_trades",
      user_id: userId || "unknown",
      account_id: account_id || "unknown",
    },
  );

  if (error) {
    await sendToLoki(
      `Failed to load trades for user ID ${userId} and account ID ${account_id}: ${error.message}`,
      {
        action: "load_trades_error",
        user_id: userId || "unknown",
        account_id: account_id || "unknown",
      },
    );
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

    await sendToLoki(
      `Added new trade: ${stock_name} with ${shares} shares and profit ${profit} for user ID ${user_id} and account ID ${account_id}`,
      {
        action: "add_trade",
        user_id,
        account_id,
      },
    );

    return NextResponse.json({ data });
  } catch (err: any) {
    await sendToLoki(`Failed to save trade: ${err.message}`, {
      action: "save_trade_error",
    });
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
