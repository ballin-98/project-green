"use client";

import { useState, useEffect } from "react";
import StockForm from "./AddStockForm";

export default function StockFormWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // render nothing until mounted

  return (
    <>
      <StockForm></StockForm>
    </>
  );
}
