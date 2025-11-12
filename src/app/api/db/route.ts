/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../lib/supabaseClient";
import { ClientStockData } from "@/app/lib/types";

// return list of stocks saved in supabase db
export async function GET(
  req: NextRequest
): Promise<NextResponse<ClientStockData[] | { error: string }>> {
  const supabase = await createClient();

  // parse the URL
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId"); // reads ?userId=<uid>

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  // load all stocks
  const { data, error } = await supabase
    .from("stocks")
    .select("*")
    .eq("user_id", userId)
    .order("quantity", { ascending: false });

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
    const { name, wealth_simple, quest_trade, dividend_frequency, user_id } =
      await req.json();

    // Insert into Supabase, mapping request fields to DB columns
    const { data, error } = await supabase.from("stocks").insert([
      {
        user_id: user_id,
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

export async function PUT(req: Request): Promise<NextResponse> {
  try {
    const supabase = await createClient();

    // Parse JSON body
    const { name, wealth_simple, quest_trade, dividend_frequency, user_id } =
      await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Missing stock name" },
        { status: 400 }
      );
    }

    // Perform the update
    const { data, error } = await supabase
      .from("stocks")
      .update({
        user_id,
        stock_name: name,
        wealth_simple,
        quest_trade,
        dividend_frequency,
      })
      .eq("stock_name", name)
      .eq("user_id", user_id)
      .select();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    // Parse the JSON body from the request
    const { stock_name, user_id } = await req.json();

    if (!stock_name) {
      return NextResponse.json(
        { error: "Missing stock name" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("stocks")
      .delete()
      .eq("stock_name", stock_name)
      .eq("user_id", user_id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error("Error deleting stock:", err);
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
