import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/middleware";
import { createAuditLog } from "@/lib/audit";
import type { JWTPayload } from "@/types";

export const GET = withAuth(async () => {
  const drives = await prisma.placementDrive.findMany({
    include: { company: true, _count: { select: { assignments: true } } },
    orderBy: { driveDate: "desc" },
  });
  return NextResponse.json({ success: true, data: drives });
}, ["ADMIN"]);

export const POST = withAuth(async (req: NextRequest, user: JWTPayload) => {
  const { companyId, driveDate, venue, status } = await req.json();
  if (!companyId || !driveDate || !venue)
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const drive = await prisma.placementDrive.create({
    data: { companyId, driveDate: new Date(driveDate), venue, status: status || "UPCOMING" },
    include: { company: true, _count: { select: { assignments: true } } },
  });
  await createAuditLog(user.id, "CREATE_DRIVE", "PlacementDrive", drive.id, drive.company.name);
  return NextResponse.json({ success: true, data: drive }, { status: 201 });
}, ["ADMIN"]);

export const PUT = withAuth(async (req: NextRequest) => {
  const { id, ...data } = await req.json();
  const drive = await prisma.placementDrive.update({
    where: { id },
    data: {
      ...(data.driveDate && { driveDate: new Date(data.driveDate) }),
      ...(data.venue && { venue: data.venue }),
      ...(data.status && { status: data.status }),
    },
    include: { company: true },
  });
  return NextResponse.json({ success: true, data: drive });
}, ["ADMIN"]);
