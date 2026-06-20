import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/types";

export const GET = withAuth(async (_req: NextRequest, user: JWTPayload) => {
  const profile = await prisma.studentProfile.findUnique({
    where: { userId: user.id },
    include: { user: { select: { name: true, email: true } } },
  });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: profile });
}, ["STUDENT"]);

export const PUT = withAuth(async (req: NextRequest, user: JWTPayload) => {
  const body = await req.json();
  const { department, cgpa, backlogs, skills, certifications, resumeUrl } = body;
  const profile = await prisma.studentProfile.update({
    where: { userId: user.id },
    data: {
      ...(department && { department }),
      ...(cgpa !== undefined && { cgpa: parseFloat(cgpa) }),
      ...(backlogs !== undefined && { backlogs: parseInt(backlogs) }),
      ...(skills && { skills }),
      ...(certifications !== undefined && { certifications }),
      ...(resumeUrl && { resumeUrl }),
    },
  });
  return NextResponse.json({ success: true, data: profile });
}, ["STUDENT"]);
