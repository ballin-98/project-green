import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { ClientStockData } from "../lib/types";

export interface StockListProps {
  stocks: ClientStockData[];
}

export default function StockList({ stocks }: StockListProps) {
  // console.log("stocks in StockList: ", stocks);
  return (
    <>
      {stocks.map((stock) => (
        <Card
          key={stock.id}
          sx={{
            marginBottom: 0.5,
            padding: 0.5,
            boxShadow: 3,
            width: "100%",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 1,
            }}
          >
            <Typography variant="h6">{stock.name}</Typography>
            <Typography variant="h6">price: {stock.price}</Typography>
            <Typography variant="body2">
              Dividend: {stock.mostRecentDividend}
            </Typography>
            <Typography variant="body2">Quantity: {stock.quantity}</Typography>
            <Typography variant="body2">
              Potential: {stock.potential}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", fontSize: 16, color: "green" }}
            >
              ${(stock.quantity * (stock.mostRecentDividend ?? 0)).toFixed(3)}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
