import { NextResponse, NextRequest } from "next/server";
import { createClient } from "../../lib/supabaseClient";
import { GoalInfo } from "@/app/lib/types";
import { sendToLoki } from "@/app/lib/loki";

export async function GET(
  req: NextRequest,
): Promise<NextResponse<GoalInfo | { error: string }>> {
  const supabase = await createClient();
  // parse the URL
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const accountId = searchParams.get("accountId");

  let query = supabase.from("goals").select("*").eq("user_id", userId);

  if (accountId && accountId.trim() !== "all") {
    query = query.eq("account_id", accountId);
  }

  const { data, error } = await query;

  // set some default data here => that will be overwritten
  let goalData: GoalInfo = { longTermGoal: 10000, shortTermGoal: 850 };
  if (data && data.length > 0) {
    goalData = JSON.parse(JSON.stringify(data[0]));
  }

  if (error) {
    await sendToLoki(
      `Failed to load goals for user ID ${userId}: ${error.message}`,
      {
        action: "load_goals_error",
        user_id: userId ?? "",
      },
    );
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(goalData);
}

export type GoalType = "longTermGoal" | "shortTermGoal";

interface UpdateGoalRequest {
  userId: string;
  field: GoalType;
  value: number;
  accountId: string;
}

type GoalsRow = {
  goals: {
    longTermGoal: number;
    shortTermGoal: number;
  };
};

export async function POST(
  req: NextRequest,
): Promise<NextResponse<{ success: boolean } | { error: string }>> {
  const supabase = await createClient();

  const body = await req.json();
  const { userId, field, value, accountId } = body as UpdateGoalRequest;

  if (!userId || !field || typeof value !== "number") {
    return NextResponse.json(
      { error: "Missing or invalid parameters" },
      { status: 400 },
    );
  }

  // Get existing goals
  const { data, error: fetchError } = await supabase
    .from("goals")
    .select("goals")
    .eq("user_id", userId)
    .eq("account_id", accountId)
    .overrideTypes<GoalsRow[]>();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  // No row yet -> create one
  if (!data || data.length === 0) {
    const newGoals = {
      longTermGoal: 100,
      shortTermGoal: 100,
      [field]: value,
    };

    const { error } = await supabase.from("goals").insert({
      user_id: userId,
      account_id: accountId,
      goals: newGoals,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  const longTermGoal = data?.[0]?.goals?.longTermGoal ?? 100;
  const shortTermGoal = data?.[0]?.goals?.shortTermGoal ?? 100;

  const updatedGoals = {
    longTermGoal,
    shortTermGoal,
    [field]: value,
  };

  const { error } = await supabase
    .from("goals")
    .update({ goals: updatedGoals })
    .eq("user_id", userId)
    .eq("account_id", accountId);

  if (error) {
    await sendToLoki(
      `Failed to update ${field} for user ID ${userId}: ${error.message}`,
      {
        action: "update_goal_error",
        user_id: userId,
        field,
      },
    );

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
