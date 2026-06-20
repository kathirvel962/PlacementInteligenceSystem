import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/middleware";
import { createNotification } from "@/lib/notifications";
import type { JWTPayload } from "@/types";

export const GET = withAuth(async (_req: NextRequest, user: JWTPayload) => {
  const profile = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const results = await prisma.placementResult.findMany({
    where: { studentProfileId: profile.id },
    include: { assignment: { include: { placementDrive: { include: { company: true } } } } },
    orderBy: { submittedAt: "desc" },
  });
  return NextResponse.json({ success: true, data: results });
}, ["STUDENT"]);

export const POST = withAuth(async (req: NextRequest, user: JWTPayload) => {
  const { assignmentId, offerLetterUrl, proofUrl, packageOffered } = await req.json();
  if (!assignmentId)
    return NextResponse.json({ error: "assignmentId required" }, { status: 400 });

  const profile = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const assignment = await prisma.driveAssignment.findUnique({ where: { id: assignmentId } });
  if (!assignment || assignment.studentProfileId !== profile.id)
    return NextResponse.json({ error: "Assignment not found" }, { status: 404 });

  const result = await prisma.placementResult.upsert({
    where: { assignmentId },
    update: { offerLetterUrl, proofUrl, packageOffered: packageOffered ? parseFloat(packageOffered) : null, status: "PENDING" },
    create: { assignmentId, studentProfileId: profile.id, offerLetterUrl, proofUrl, packageOffered: packageOffered ? parseFloat(packageOffered) : null },
  });

  // notify admins
  const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
  await Promise.all(admins.map(a => createNotification(a.id, "New Result Submitted", `Student submitted a placement result for review.`)));

  return NextResponse.json({ success: true, data: result });
}, ["STUDENT"]);
