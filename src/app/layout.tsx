// app/layout.tsx
import { ReactNode } from "react";
import AppHeader from "./stocks/AppHeader";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
