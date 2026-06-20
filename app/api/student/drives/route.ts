import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/types";

export const GET = withAuth(async (_req: NextRequest, user: JWTPayload) => {
  const profile = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const assignments = await prisma.driveAssignment.findMany({
    where: { studentProfileId: profile.id },
    include: {
      placementDrive: { include: { company: true } },
      result: true,
    },
    orderBy: { assignedAt: "desc" },
  });
  return NextResponse.json({ success: true, data: assignments });
}, ["STUDENT"]);

export const PATCH = withAuth(async (req: NextRequest, user: JWTPayload) => {
  const { id, status } = await req.json();

  // Students can only set these two statuses
  if (!(["ACCEPTED", "ATTENDED"] as string[]).includes(status))
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  const profile = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  // Ensure the assignment belongs to this student
  const assignment = await prisma.driveAssignment.findFirst({
    where: { id, studentProfileId: profile.id },
  });
  if (!assignment) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });

  const updated = await prisma.driveAssignment.update({
    where: { id },
    data: { status },
  });
  return NextResponse.json({ success: true, data: updated });
}, ["STUDENT"]);
