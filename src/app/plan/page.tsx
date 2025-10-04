import { getStock, getTrades } from "../lib/stockService";
import PlanDashboard from "./PlanDashboard";

export default async function PlanPage() {
  const response = await getStock();
  const trades = await getTrades();
  return (
    <div style={{ background: "#FAFAFA" }}>
      <PlanDashboard stocks={response} trades={trades} />
    </div>
  );
}
