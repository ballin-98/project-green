import { getStock, getTrades } from "../lib/stockService";
import Dashboard from "./dashboard";

export default async function StocksPage() {
  const response = await getStock();
  console.log("response: ", response);
  const trades = await getTrades();
  console.log("trades: ", trades);
  return (
    <div style={{ background: "#FAFAFA" }}>
      <Dashboard stocks={response} trades={trades} />
    </div>
  );
}
