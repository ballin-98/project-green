import { Suspense } from "react";
import EditStockForm from "./EditStockForm";

export const dynamic = "force-dynamic";

export default function NewStockPage() {
  <Suspense fallback={<div>Loading...</div>}>
    return <EditStockForm />;
  </Suspense>;
}
