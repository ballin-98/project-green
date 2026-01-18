import { Suspense } from "react";
import NewTradeForm from "./NewTradeForm";

export default function NewStockPage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <NewTradeForm />
    </Suspense>
  );
}
