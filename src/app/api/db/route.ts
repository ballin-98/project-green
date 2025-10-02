/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { createClient } from "../../lib/supabaseClient";
import { ClientStockData } from "@/app/lib/types";

// return list of stocks saved in supabase db
export async function GET(): Promise<
  NextResponse<ClientStockData[] | { error: string }>
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("stocks")
    .select("*")
    .order("quantity", { ascending: false });
  // console.log("data from db: ", data);
  let stockData: ClientStockData[] = [];
  if (data) {
    stockData = data?.map((stock) => ({
      id: stock.id,
      name: stock.stock_name,
      wealthSimple: stock.wealth_simple,
      questTrade: stock.quest_trade,
      dividendFrequency: stock.dividend_frequency,
      quantity: stock.quantity,
      potential: 0,
      price: 0,
    }));
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(stockData);
}

// save stock to stocks table in supabase db
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const supabase = await createClient();

    // Parse the JSON body from the request
    const { name, wealth_simple, quest_trade, dividend_frequency } =
      await req.json();

    console.log("dividend frequency in request: ", dividend_frequency);

    // Insert into Supabase, mapping request fields to DB columns
    const { data, error } = await supabase.from("stocks").insert([
      {
        stock_name: name,
        wealth_simple: wealth_simple,
        quest_trade: quest_trade,
        dividend_frequency: dividend_frequency,
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
