import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/types";

export const GET = withAuth(async (_req: NextRequest, user: JWTPayload) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ success: true, data: notifications });
}, ["STUDENT", "ADMIN"]);

export const PATCH = withAuth(async (_req: NextRequest, user: JWTPayload) => {
  await prisma.notification.updateMany({
    where: { userId: user.id, isRead: false },
    data: { isRead: true },
  });
  return NextResponse.json({ success: true });
}, ["STUDENT", "ADMIN"]);
