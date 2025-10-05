import { getStock } from "../lib/stockService";
import PlanDashboard from "./PlanDashboard";

export default async function PlanPage() {
  const response = await getStock();
  return (
    <div style={{ background: "#FAFAFA" }}>
      <PlanDashboard stocks={response} />
    </div>
  );
}
