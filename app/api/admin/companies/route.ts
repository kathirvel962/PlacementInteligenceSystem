import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/middleware";
import { createAuditLog } from "@/lib/audit";
import type { JWTPayload } from "@/types";

export const GET = withAuth(async () => {
  const companies = await prisma.company.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ success: true, data: companies });
}, ["ADMIN"]);

export const POST = withAuth(async (req: NextRequest, user: JWTPayload) => {
  const { name, role, package: pkg, minCgpa, allowedBacklogs, requiredSkills } = await req.json();
  if (!name || !role || pkg === undefined)
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const company = await prisma.company.create({
    data: { name, role, package: parseFloat(pkg), minCgpa: parseFloat(minCgpa) || 0, allowedBacklogs: parseInt(allowedBacklogs) || 0, requiredSkills: requiredSkills || "" },
  });
  await createAuditLog(user.id, "CREATE_COMPANY", "Company", company.id, name);
  return NextResponse.json({ success: true, data: company }, { status: 201 });
}, ["ADMIN"]);

export const PUT = withAuth(async (req: NextRequest) => {
  const { id, ...data } = await req.json();
  const company = await prisma.company.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.role && { role: data.role }),
      ...(data.package !== undefined && { package: parseFloat(data.package) }),
      ...(data.minCgpa !== undefined && { minCgpa: parseFloat(data.minCgpa) }),
      ...(data.allowedBacklogs !== undefined && { allowedBacklogs: parseInt(data.allowedBacklogs) }),
      ...(data.requiredSkills && { requiredSkills: data.requiredSkills }),
    },
  });
  return NextResponse.json({ success: true, data: company });
}, ["ADMIN"]);
