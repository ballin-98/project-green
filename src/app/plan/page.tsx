import { getStock } from "../lib/stockService";
import PlanDashboard from "./PlanDashboard";

export const dynamic = "force-dynamic";

export default async function PlanPage() {
  const response = await getStock();
  const monthlyGoal = Number(process.env.NEXT_PUBLIC_MONTHLY_GOAL) || 0;
  const yearlyGoal = Number(process.env.NEXT_PUBLIC_YEARLY_GOAL) || 0;
  return (
    <div style={{ background: "#FAFAFA" }}>
      <PlanDashboard
        stocks={response}
        monthlyGoal={monthlyGoal}
        yearlyGoal={yearlyGoal}
      />
    </div>
  );
}
