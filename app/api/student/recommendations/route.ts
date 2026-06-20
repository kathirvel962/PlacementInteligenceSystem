import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/middleware";
import { recommendCompanies } from "@/lib/recommendation";
import type { JWTPayload } from "@/types";

export const GET = withAuth(async (_req: NextRequest, user: JWTPayload) => {
  const profile = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const companies = await prisma.company.findMany();
  const recommendations = recommendCompanies(profile, companies);
  return NextResponse.json({ success: true, data: recommendations });
}, ["STUDENT"]);
