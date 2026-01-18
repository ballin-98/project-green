import { Suspense } from "react";
import TradeForm from "./NewTradeForm";

export default function NewStockPage() {
  <Suspense fallback={<div>Loading…</div>}>
    <TradeForm />
  </Suspense>;
}
