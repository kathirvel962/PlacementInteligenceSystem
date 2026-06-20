import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import type { JWTPayload, UserRole } from "@/types";

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7);
  const cookie = req.cookies.get("token")?.value;
  return cookie ?? null;
}

export function withAuth(
  handler: (req: NextRequest, user: JWTPayload) => Promise<NextResponse>,
  roles?: UserRole[]
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const token = getTokenFromRequest(req);
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
      const user = verifyToken(token) as JWTPayload;
      if (roles && !roles.includes(user.role)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return handler(req, user);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  };
}
