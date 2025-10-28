// import { getStock, getTrades } from "../lib/stockService";
import Dashboard from "./dashboard";

export const dynamic = "force-dynamic";

export default async function StocksPage() {
  // const response = await getStock();
  // const trades = await getTrades();
  const monthlyGoal = Number(process.env.NEXT_PUBLIC_MONTHLY_GOAL) || 0;
  const yearlyGoal = Number(process.env.NEXT_PUBLIC_YEARLY_GOAL) || 0;
  console.log("Monthly Goal:", monthlyGoal);
  console.log("Yearly Goal:", yearlyGoal);
  // console.log("StocksPage response:", response);
  return (
    <div style={{ background: "#FAFAFA" }}>
      <Dashboard />
    </div>
  );
}
