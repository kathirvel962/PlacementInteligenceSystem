import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/middleware";
import { createAuditLog } from "@/lib/audit";
import { createNotification } from "@/lib/notifications";
import type { JWTPayload } from "@/types";

export const GET = withAuth(async (_req: NextRequest) => {
  const students = await prisma.studentProfile.findMany({
    include: { user: { select: { id: true, name: true, email: true, createdAt: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ success: true, data: students });
}, ["ADMIN"]);

export const PATCH = withAuth(async (req: NextRequest, user: JWTPayload) => {
  const { studentProfileId, isVerified } = await req.json();
  const profile = await prisma.studentProfile.update({
    where: { id: studentProfileId },
    data: { isVerified },
    include: { user: true },
  });
  await createAuditLog(user.id, isVerified ? "VERIFY_STUDENT" : "UNVERIFY_STUDENT", "StudentProfile", studentProfileId);
  await createNotification(
    profile.userId,
    isVerified ? "Profile Approved" : "Profile Rejected",
    isVerified ? "Your profile has been verified by the placement officer." : "Your profile verification was rejected."
  );
  return NextResponse.json({ success: true, data: profile });
}, ["ADMIN"]);
