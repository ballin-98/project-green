import PlanDashboard from "./PlanDashboard";

export default async function PlanPage() {
  const monthlyGoal = 750;
  const yearlyGoal = 8000;
  return (
    <div style={{ background: "#FAFAFA" }}>
      <PlanDashboard monthlyGoal={monthlyGoal} yearlyGoal={yearlyGoal} />
    </div>
  );
}
