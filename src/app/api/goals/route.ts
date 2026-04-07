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

  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId);

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
