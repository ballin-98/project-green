import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../lib/supabaseClient";

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  console.log("userId received in GET /api/accounts:", userId);

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("accounts")
    .select("id, nickname, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const body = await req.json();
  const { userId, nickname } = body;

  if (!userId || !nickname) {
    return NextResponse.json(
      { error: "userId and nickname are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("accounts")
    .insert({
      user_id: userId,
      nickname,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const supabase = await createClient();

  const body = await req.json();
  const { accountId, nickname } = body;

  if (!accountId || !nickname) {
    return NextResponse.json(
      { error: "accountId and nickname are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("accounts")
    .update({ nickname })
    .eq("id", accountId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();

  // Parse JSON body
  const body = await req.json();
  const { accountId } = body;

  console.log("got the account id");

  if (!accountId) {
    return NextResponse.json(
      { error: "accountId is required" },
      { status: 400 }
    );
  }

  console.log("about to hit the db");

  const { error } = await supabase
    .from("accounts")
    .delete()
    .eq("id", accountId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Account deleted successfully" });
}
