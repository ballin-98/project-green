// app/layout.tsx
import { ReactNode } from "react";
import AppHeader from "./stocks/AppHeader";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body>
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
