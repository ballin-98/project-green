"use client";

import { ReactNode } from "react";
import AppHeader from "./stocks/AppHeader";
import { UserProvider } from "./context/UserContext";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body>
        <UserProvider>
          <AppHeader />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
