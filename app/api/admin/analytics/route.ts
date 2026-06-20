import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/middleware";

export const GET = withAuth(async () => {
  const [totalStudents, allStudents, companies, approvedResults] = await Promise.all([
    prisma.studentProfile.count(),
    prisma.studentProfile.findMany({ select: { department: true } }),
    prisma.company.findMany({ select: { id: true, name: true, package: true } }),
    prisma.placementResult.findMany({
      where: { status: "APPROVED" },
      select: {
        packageOffered: true,
        studentProfileId: true,
        studentProfile: { select: { department: true } },
        assignment: {
          select: {
            placementDrive: {
              select: {
                company: { select: { name: true, package: true } },
              },
            },
          },
        },
      },
    }),
  ]);

  const placedStudentIds = new Set(approvedResults.map(r => r.studentProfileId));

  // Use packageOffered if provided, otherwise fall back to company package
  const packages = approvedResults.map(r =>
    r.packageOffered && r.packageOffered > 0
      ? r.packageOffered
      : r.assignment.placementDrive.company.package
  );

  const highestPackage = packages.length ? Math.max(...packages) : null;
  const averagePackage = packages.length
    ? Math.round((packages.reduce((a, b) => a + b, 0) / packages.length) * 100) / 100
    : null;

  // Department-wise stats
  const deptMap: Record<string, { total: number; placed: number }> = {};
  allStudents.forEach(s => {
    if (!deptMap[s.department]) deptMap[s.department] = { total: 0, placed: 0 };
    deptMap[s.department].total++;
  });
  approvedResults.forEach(r => {
    const dept = r.studentProfile.department;
    if (deptMap[dept]) deptMap[dept].placed++;
  });

  // Company-wise stats
  const companyMap: Record<string, number> = {};
  approvedResults.forEach(r => {
    const cname = r.assignment.placementDrive.company.name;
    companyMap[cname] = (companyMap[cname] || 0) + 1;
  });

  return NextResponse.json({
    success: true,
    data: {
      totalStudents,
      placedStudents: placedStudentIds.size,
      unplacedStudents: totalStudents - placedStudentIds.size,
      placementPercentage:
        totalStudents > 0 ? Math.round((placedStudentIds.size / totalStudents) * 100) : 0,
      highestPackage,
      averagePackage,
      departmentStats: Object.entries(deptMap).map(([dept, v]) => ({ department: dept, ...v })),
      companyStats: Object.entries(companyMap).map(([company, count]) => ({ company, count })),
    },
  });
}, ["ADMIN"]);
