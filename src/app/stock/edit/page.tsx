import EditStockForm from "./EditStockForm";
import { Suspense } from "react";

export default function NewStockPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditStockForm />
    </Suspense>
  );
}
