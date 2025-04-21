"use client";
import { useParams } from "next/navigation";

export default function StockPage() {
  const { ticker } = useParams();

  return (
    <html>
      <body>
        <div>
          <h1>Stock Page</h1>
          <p>Welcome to the stock page for {ticker}!</p>
        </div>
      </body>
    </html>
  );
}
