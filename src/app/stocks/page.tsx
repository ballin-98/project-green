import { getStock, getTrades } from "../lib/stockService";
import Dashboard from "./dashboard";

export default async function StocksPage() {
  const response = await getStock();
  const trades = await getTrades();
  return (
    <div style={{ background: "#FAFAFA" }}>
      <Dashboard stocks={response} trades={trades} />
    </div>
  );
}
