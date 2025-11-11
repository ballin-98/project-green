import { NextResponse, NextRequest } from "next/server";
import { createClient } from "../../lib/supabaseClient";
import { GoalInfo } from "@/app/lib/types";

export async function GET(
  req: NextRequest
): Promise<NextResponse<GoalInfo | { error: string }>> {
  const supabase = await createClient();
  // parse the URL
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId);

  let goalData: GoalInfo = { longTermGoal: 0, shortTermGoal: 0 };
  if (data) {
    goalData = JSON.parse(JSON.stringify(data[0]));
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(goalData);
}
