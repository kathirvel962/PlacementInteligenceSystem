import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/middleware";
import { createAuditLog } from "@/lib/audit";
import { createNotification } from "@/lib/notifications";
import type { JWTPayload } from "@/types";

export const GET = withAuth(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const results = await prisma.placementResult.findMany({
    where: status ? { status: status as "PENDING" | "APPROVED" | "REJECTED" } : undefined,
    include: {
      studentProfile: { include: { user: { select: { name: true, email: true } } } },
      assignment: { include: { placementDrive: { include: { company: true } } } },
    },
    orderBy: { submittedAt: "desc" },
  });
  return NextResponse.json({ success: true, data: results });
}, ["ADMIN"]);

export const PATCH = withAuth(async (req: NextRequest, user: JWTPayload) => {
  const { id, status, adminNote } = await req.json();
  if (!["APPROVED", "REJECTED"].includes(status))
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  const result = await prisma.placementResult.update({
    where: { id },
    data: { status, adminNote },
    include: { studentProfile: { include: { user: true } }, assignment: { include: { placementDrive: { include: { company: true } } } } },
  });

  if (status === "APPROVED") {
    await prisma.driveAssignment.update({ where: { id: result.assignmentId }, data: { status: "SELECTED" } });
  }

  await createAuditLog(user.id, `RESULT_${status}`, "PlacementResult", id);
  await createNotification(
    result.studentProfile.userId,
    `Result ${status}`,
    `Your placement result for ${result.assignment.placementDrive.company.name} has been ${status.toLowerCase()}.${adminNote ? ` Note: ${adminNote}` : ""}`
  );
  return NextResponse.json({ success: true, data: result });
}, ["ADMIN"]);
