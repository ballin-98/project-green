import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sendToLoki } from "./app/lib/loki";

export function middleware(req: NextRequest) {
  sendToLoki("request", {
    method: req.method,
    path: req.nextUrl.pathname,
  });

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
