import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/middleware";
import { createAuditLog } from "@/lib/audit";
import { createNotification } from "@/lib/notifications";
import type { JWTPayload } from "@/types";

export const GET = withAuth(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const driveId = searchParams.get("driveId");
  const assignments = await prisma.driveAssignment.findMany({
    where: driveId ? { placementDriveId: driveId } : undefined,
    include: {
      studentProfile: { include: { user: { select: { name: true, email: true } } } },
      placementDrive: { include: { company: true } },
    },
    orderBy: { assignedAt: "desc" },
  });
  return NextResponse.json({ success: true, data: assignments });
}, ["ADMIN"]);

export const POST = withAuth(async (req: NextRequest, user: JWTPayload) => {
  const { studentProfileId, placementDriveId } = await req.json();
  if (!studentProfileId || !placementDriveId)
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const exists = await prisma.driveAssignment.findFirst({ where: { studentProfileId, placementDriveId } });
  if (exists) return NextResponse.json({ error: "Already assigned" }, { status: 409 });

  const assignment = await prisma.driveAssignment.create({
    data: { studentProfileId, placementDriveId, status: "ASSIGNED" },
    include: { studentProfile: { include: { user: true } }, placementDrive: { include: { company: true } } },
  });

  await createAuditLog(user.id, "ASSIGN_STUDENT", "DriveAssignment", assignment.id);
  await createNotification(
    assignment.studentProfile.userId,
    "New Drive Assignment",
    `You have been assigned to ${assignment.placementDrive.company.name} placement drive on ${assignment.placementDrive.driveDate.toDateString()}.`
  );
  return NextResponse.json({ success: true, data: assignment }, { status: 201 });
}, ["ADMIN"]);

export const PATCH = withAuth(async (req: NextRequest) => {
  const { id, status } = await req.json();
  const assignment = await prisma.driveAssignment.update({
    where: { id },
    data: { status },
  });
  return NextResponse.json({ success: true, data: assignment });
}, ["ADMIN"]);
