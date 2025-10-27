import { Suspense } from "react";
import EditStockForm from "./EditStockForm";

export default function NewStockPage() {
  <Suspense fallback={<div>Loading...</div>}>
    return <EditStockForm />;
  </Suspense>;
}
